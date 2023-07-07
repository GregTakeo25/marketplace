import { OpenAI } from "langchain/llms/openai";
import { ConversationChain, LLMChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import { Repo, RepoFileContentTool } from "./github/index.js";
import { Options } from "./options.js";
import { SerpAPI } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

type DiscussionSummary = {
  topic: string;
  summary: string;
};
export class LLM {
  private readonly model: OpenAI;

  constructor() {
    this.model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.3,
      modelName: "gpt-4",
    });
  }

  repoPurpose = async (repo: Repo, { spinner }: Options) => {
    const repoDetails = await repo.details();
    const description = repoDetails && repoDetails.description;
    const readme = ((await repo.readme()) || "").substring(0, 15000);

    spinner.text = "Generating repository purpose";
    return await this.model.call(`
      Explain the purpose of ${repo.name} github repository.
      Do not include the repository name in the response.
      Answer with less than 100 words.
      Description: "${description}"
      Documentation: ${readme}
    `);
  };

  explainTechnicalTerms = async (overview: string, { spinner }: Options) => {
    const tools = [new SerpAPI(process.env.SERP_API_KEY)];

    const executor = await initializeAgentExecutorWithOptions(tools, this.model, {
      agentType: "zero-shot-react-description",
      verbose: !!process.env.DEBUG,
    });

    spinner.text = "Generating definitions";
    const { output } = await executor.call({
      input: `
      Define the technical terms in the following text.
      Only focus on the complex terms a senior developer is not expected to know.
      Reply only with the terms and their definitions as a list in markdown format.
      Add links to internet resources to get more details on each term.
      Text:
      ${overview}
    `,
    });

    return output;
  };

  summarizeOverviews = async (texts: string[], { spinner }: Options) => {
    texts = texts.map(text => text.trim()).filter(text => text.length > 0);
    if (texts.length === 0) {
      return null;
    }

    spinner.text = "Summarizing overviews";
    return await this.model.call(`
      Write a summary of the following project description.
      Answer with less than 300 words.
      Descriptions:
      ${texts.join("\n")}
    `);
  };

  repoGuidelines = async (repo: Repo, { spinner }: Options) => {
    const tools = [new RepoFileContentTool(repo)];

    const executor = await initializeAgentExecutorWithOptions(tools, this.model, {
      agentType: "zero-shot-react-description",
      verbose: !!process.env.DEBUG,
    });

    const repoDescriptionFiles = (await repo.files(true))
      .filter(
        path =>
          path?.toLowerCase().endsWith(".md") ||
          path?.toLowerCase().endsWith(".txt") ||
          path?.toLowerCase().includes("contribut") ||
          path?.toLowerCase().includes("develop") ||
          path?.toLowerCase().includes("guideline") ||
          path?.toLowerCase().includes("conduct")
      )
      .slice(0, 100)
      .map(text => text.trim());

    if (!repoDescriptionFiles.some(text => text.length > 0)) {
      return null;
    }

    spinner.text = "Asking for the repo contribution guidelines";
    const { output } = await executor.call({
      input: `
        Examine the ${repo.owner}/${repo.name} GitHub repository's contribution guidelines.
        Contribution guidelines describe how a developer should contribute to the repository.

        The list of files that may contain information about contribution guidelines is:
        ${repoDescriptionFiles}

        Extract and summarize the specific instructions or guidelines for contributions present in these files.
        If there are no contribution guidelines, simply state, 'There doesn't seem to be any contribution guidelines.'

        Write in affirmative style.
        Write guidelines in bullet points.
        `,
    });

    return output;
  };

  summarizeGuidelines = async (texts: string[], { spinner }: Options) => {
    texts = texts.map(text => text.trim()).filter(text => text.length > 0);
    if (texts.length === 0) {
      return null;
    }

    spinner.text = "Summarizing contribution guidelines";
    return await this.model.call(`
        Here is a list of guidelines:
        ${texts.join("\n")}

        Remove duplicate bullet points from the list above.
        Keep only the 4 most important and relevant bullet points.
        Do not add any introductory text before the bullet points.
    `);
  };

  repoDiscussions = async (repo: Repo, { spinner }: Options): Promise<DiscussionSummary[]> => {
    spinner.text = "Analyzing recent discussions";

    const prompt = new PromptTemplate({
      template: `
        Based on the title, the description of a github discussion and the list of its comments:
        - tell what the discussion is about
        - give the main challenge involved by this discussion
        - answer with less than 100 words

        The title is: "{title}"

        The description is: "{body}"

        The comments are:
        {comments}
      `,
      inputVariables: ["title", "body", "comments"],
    });

    const chain = new LLMChain({ llm: this.model, prompt });

    const mostCommentedIssues = await repo.mostCommentedIssues();
    const issueSummaries: Promise<DiscussionSummary>[] = mostCommentedIssues
      .slice(0, 5)
      .map(async ({ number, title, body }) => {
        const comments = await repo.issueComments(number).then(comments =>
          comments
            .slice(0, 5)
            .map(({ body }) => `- ${body}`)
            .join("\n")
        );

        return {
          topic: title,
          summary: await chain
            .call({
              title,
              body,
              comments,
            })
            .then(({ text }) => text),
        };
      });

    const recentDiscussions = await repo.recentDiscussions({ discussionsCount: 5, commentsCountPerDiscussion: 5 });
    const discussionExplainations: Promise<DiscussionSummary>[] = recentDiscussions.map(
      async ({ title, body, comments }) => ({
        topic: title || "",
        summary: await chain
          .call({
            title,
            body,
            comments: comments.map(({ body }) => `- ${body}`).join("\n"),
          })
          .then(({ text }) => text),
      })
    );

    return await Promise.all([...issueSummaries, ...discussionExplainations]);
  };

  summarizeDiscussions = async (discussions: DiscussionSummary[], { spinner }: Options) => {
    if (discussions.length === 0) {
      return "";
    }

    spinner.text = "Summarizing repo discussions";
    return await this.model.call(`
        Based on the topic and summary of the following discussions in a team,
        list the top 3 most important challenges/concerns the team is facing.
        Answer with a list in markdown format.
        Discussions:
        ${discussions.map(({ topic, summary }) => `- topic: ${topic}\n  summary: ${summary}`).join("\n\n")}
    `);
  };
}
