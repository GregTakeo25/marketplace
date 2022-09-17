use crate::{Account, ContributorAccount, GithubProjectId, ProjectAggregate, Projection};

#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct LeadContributor {
	project_id: GithubProjectId,
	account: Account,
}

impl Projection for LeadContributor {
	type A = ProjectAggregate;
}

impl LeadContributor {
	pub fn new(project_id: GithubProjectId, account: ContributorAccount) -> Self {
		Self {
			project_id,
			account,
		}
	}

	pub fn project_id(&self) -> &GithubProjectId {
		&self.project_id
	}

	pub fn account(&self) -> &Account {
		&self.account
	}
}