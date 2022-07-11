import requests
import json
import os
import csv
from dotenv import load_dotenv


CONTRIBUTIONS = "./scripts/feeder/contributions.csv"

load_dotenv()
API_KEY = os.environ["API_KEY"]
GITHUB_KEY = os.environ["GITHUB_KEY"]
HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Api-Key": API_KEY
}
API_URL = "http://localhost:8000"


def add_projects(projects_list):
    for project in projects_list:
        project_json = {"name": project[0], "owner": project[1]}
        print(f'Adding project {project_json["name"]}')
        api_response = api_post("projects", project_json)
        if api_response["error"] == True:
            print("Couldn't add project", api_response)

def get_projects():
    print("Fetching projects..")
    projects_json = api_get("projects")
    return projects_json

def add_contributions(contributions_list):
    for contribution in contributions_list:
        print(f'Adding contribution {contribution["contribution_id"]}')
        api_response = api_post("contribution", contribution)
        if api_response["error"] == True:
            print("Couldn't add contribution", api_response)
            

def api_post(route, json_data):
    api_request = requests.post(
        API_URL + '/' + route,
        json=json_data,
        headers= {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Api-Key": API_KEY
            }
    )

    if api_request.status_code in [202]:
        return {'error': False}
    else:
        return {'error': True, 'status': api_request.status_code}

def api_get(route):
    api_request = requests.get(
        API_URL + '/' + route,
        headers= { "Accept": "application/json"},
    )

    if api_request.status_code == 200:
        request_json = api_request.json()
        return request_json
    else:
        return None

projects_by_name = dict({})

def process_projects(projects_json):
    for project in projects_json:
        projects_by_name[project["name"]] = project


def load_contributions(contribution_csv):
    with open(contribution_csv, 'r', encoding='utf_8', newline='') as csv_file:
        print(f"Loading {contribution_csv}")
        contributions = []
        csv_reader = csv.reader(csv_file, delimiter=',')
        next(csv_reader)
        for row in csv_reader:
            contributions.append(row)
    return contributions

def contribution_from_issue(issue_url):
    data = issue_url.split("/")
    assert len(data) == 7
    assert data[2] == 'github.com'
    owner = data[3]
    project = data[4]
    issue = data[6]
    return (owner, project, issue)

GITHUB_API = "https://api.github.com/repos"

def fetch_contribution_id(issue_url):
    (owner, project, issue) = contribution_from_issue(issue_url)
    URL = f"{GITHUB_API}/{owner}/{project}/issues/{issue}"
    api_request = requests.get(
        URL,
        headers= { 
            "Accept": "application/vnd.github+json",
            "Authorization": GITHUB_KEY, 
        },
    )
    if api_request.status_code == 200:
        request_json = api_request.json()
        id_value = request_json["id"]
        # print(issue_url, id_value)
        return {'error': False, "result": id_value }
    else:
        return {'error': True, 'status': api_request.status_code}

if __name__ == "__main__":
    contribution_list = load_contributions(CONTRIBUTIONS)

    projects = set()
    for issue,_ in contribution_list:
        (owner, project, _) = contribution_from_issue(issue)
        projects.add((project, owner))

    add_projects(projects)

    projects_json = get_projects()
    if projects_json:
        process_projects(projects_json)
    else:
        print("Couldn't fetch projects")

    contributions = []
    for issue,gate in contribution_list:
        (_, project, issue_number) = contribution_from_issue(issue)

        if project not in projects_by_name:
            print("Project is not added")
            continue
        project_id = projects_by_name[project]["id"]

        contribution = {
            "contribution_id" : issue_number,
            "project_id" : project_id,
            "gate": int(gate)
        }
        contributions.append(contribution)

    add_contributions(contributions)
    print('Done')
