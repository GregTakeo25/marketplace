use std::sync::Arc;

use http_api_problem::{HttpApiProblem, StatusCode};
use infrastructure::{database, github};
use olog::{error, IntoField};
use presentation::http::guards::ApiKey;
use rocket::State;

use crate::github_indexer::indexers::{self, Indexer};

#[post("/repo/<repo_id>/issue/<issue_number>")]
pub async fn index(
	_api_key: ApiKey,
	repo_id: i64,
	issue_number: i64,
	database: &State<Arc<database::Client>>,
	github: &State<Arc<github::Client>>,
) -> Result<(), HttpApiProblem> {
	let database = (*database).clone();
	let github = (*github).clone();

	indexers::issue::new(github, database.clone())
		.index(&(repo_id.into(), issue_number.into()).into())
		.await
		.map_err(|e| {
			let error_message = "Error while indexing Github issue";
			error!(error = e.to_field(), "{error_message}");
			HttpApiProblem::new(StatusCode::INTERNAL_SERVER_ERROR)
				.title(error_message.to_string())
				.detail(e.to_string())
		})?;

	Ok(())
}
