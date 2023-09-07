#[macro_use]
extern crate diesel;

use anyhow::Result;
use olog::info;
use rocket::http::{Header, Status};
use rstest::rstest;
use serde_json::json;
use testcontainers::clients::Cli;

use crate::context::{
	docker,
	utils::{api_key_header, jwt},
	Context,
};

mod context;
mod models;

#[rstest]
#[tokio::test(flavor = "multi_thread")]
pub async fn fetch_pull_requests(docker: &'static Cli) {
	let mut test = Test {
		context: Context::new(docker).await.expect("Unable to create test context"),
	};

	test.should_fetch_a_pr_given_a_repo_owner_repo_name_pr_number()
		.await
		.expect("should_fetch_a_pr_given_a_repo_owner_repo_name_pr_number");
}

struct Test<'a> {
	context: Context<'a>,
}

impl<'a> Test<'a> {
	async fn should_fetch_a_pr_given_a_repo_owner_repo_name_pr_number(&mut self) -> Result<()> {
		info!("should_fetch_a_pr_given_a_repo_owner_repo_name_pr_number");
		// Given
		let resource = "/api/pull_requests/repo_onwer_test_2/repo_name_test_2/222";

		// When
		let response = self
			.context
			.http_client
			.get(resource.to_string())
			.header(api_key_header())
			.header(Header::new(
				"Authorization",
				format!("Bearer {}", jwt(None)),
			))
			.dispatch()
			.await;

		// Then
		assert_eq!(response.status(), Status::Ok);
		let pr: serde_json::Value = response.into_json().await.unwrap();
		assert_eq!(
			pr,
			json!({
				"id": 1471540266,
				"repoId": 498695724,
				"number": 222,
				"title": "Improve indexer",
				"author": {
				  "id": 43467246,
				  "login": "AnthonyBuisset",
				  "avatarUrl": "https://avatars.githubusercontent.com/u/43467246?v=4",
				  "htmlUrl": "https://github.com/AnthonyBuisset"
				},
				"htmlUrl": "https://github.com/repo_owner_test_2/repo_name_test_2/pull/222",
				"status": "MERGED",
				"createdAt": "2023-08-11T09:49:15Z",
				"updatedAt": "2023-08-11T10:10:37Z",
				"mergedAt": "2023-08-11T10:10:36Z",
				"closedAt": "2023-08-11T10:10:36Z"
			})
		);
		Ok(())
	}
}