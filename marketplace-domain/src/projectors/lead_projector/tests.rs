use super::*;
use crate::*;
use mockall::predicate::eq;
use rstest::*;

#[fixture]
fn lead_contributor_projection_repository() -> MockLeadContributorProjectionRepository {
	MockLeadContributorProjectionRepository::new()
}

#[fixture]
fn project_id() -> ProjectId {
	1324
}

#[fixture]
fn contributor_account_address() -> ContributorAccountAddress {
	"0x5632".parse().unwrap()
}

#[fixture]
fn on_lead_contributor_added_event(
	project_id: ProjectId,
	contributor_account_address: ContributorAccountAddress,
) -> Event {
	Event::Project(ProjectEvent::LeadContributorAdded {
		project_id,
		contributor_account: contributor_account_address,
	})
}

#[fixture]
fn on_lead_contributor_removed_event(
	project_id: ProjectId,
	contributor_account_address: ContributorAccountAddress,
) -> Event {
	Event::Project(ProjectEvent::LeadContributorRemoved {
		project_id,
		contributor_account: contributor_account_address,
	})
}

#[rstest]
#[case(on_lead_contributor_added_event(project_id(), contributor_account_address()))]
async fn on_lead_contributor_added(
	mut lead_contributor_projection_repository: MockLeadContributorProjectionRepository,
	#[case] event: Event,
	project_id: ProjectId,
	contributor_account_address: ContributorAccountAddress,
) {
	lead_contributor_projection_repository
		.expect_upsert()
		.with(eq(LeadContributorProjection::new(
			project_id,
			contributor_account_address,
		)))
		.times(1)
		.returning(|_| Ok(()));

	let projector = LeadContributorProjector::new(Arc::new(lead_contributor_projection_repository));
	projector.on_event(&event).await;
}

#[rstest]
#[case(on_lead_contributor_removed_event(project_id(), contributor_account_address()))]
async fn on_lead_contributor_removed(
	mut lead_contributor_projection_repository: MockLeadContributorProjectionRepository,
	#[case] event: Event,
	project_id: ProjectId,
	contributor_account_address: ContributorAccountAddress,
) {
	lead_contributor_projection_repository
		.expect_delete()
		.with(eq(project_id), eq(contributor_account_address))
		.times(1)
		.returning(|_, _| Ok(()));

	let projector = LeadContributorProjector::new(Arc::new(lead_contributor_projection_repository));
	projector.on_event(&event).await;
}