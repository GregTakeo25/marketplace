use rstest::fixture;
use testcontainers::clients::Cli;

pub mod event_listeners;
pub mod github_indexer;

#[fixture]
#[once]
pub fn docker() -> Cli {
	Cli::docker()
}