use crate::domain::*;
use mapinto::ResultMapErrInto;
use mockall::automock;
use std::sync::Arc;

#[automock]
// Usecase must be `Send` and `Sync` as it is managed in a rocket State<T> that requires T to be
// `Send` and `Sync`
pub trait Usecase: Send + Sync {
	fn send_unassign_request(&self, contribution_id: ContributionId) -> Result<(), DomainError>;
}

pub struct UnassignContribution {
	contribution_service: Arc<dyn ContributionService>,
	contribution_repository: Arc<dyn ContributionRepository>,
}

impl UnassignContribution {
	pub fn new_usecase_boxed(
		contribution_service: Arc<dyn ContributionService>,
		contribution_repository: Arc<dyn ContributionRepository>,
	) -> Box<dyn Usecase> {
		Box::new(Self {
			contribution_service,
			contribution_repository,
		})
	}
}

impl Usecase for UnassignContribution {
	fn send_unassign_request(&self, contribution_id: ContributionId) -> Result<(), DomainError> {
		match self.contribution_repository.find_by_id(contribution_id)? {
			Some(contribution) => self
				.contribution_service
				.unassign_contributor(contribution.onchain_id)
				.map_err_into(),
			None => Err(ContributionRepositoryError::NotFound.into()),
		}
	}
}

#[cfg(test)]
mod test {
	use super::*;
	use mockall::predicate::*;
	use rstest::*;
	use starknet::core::types::FieldElement;
	use thiserror::Error;

	#[derive(Debug, Error)]
	#[error("Oops")]
	struct Error;

	#[fixture]
	fn contribution_service() -> MockContributionService {
		MockContributionService::new()
	}

	#[fixture]
	fn contribution_repository() -> MockContributionRepository {
		MockContributionRepository::new()
	}

	#[rstest]
	fn unassign_contribution_success(
		mut contribution_service: MockContributionService,
		mut contribution_repository: MockContributionRepository,
	) {
		contribution_repository
			.expect_find_by_id()
			.with(eq(ContributionId::from_u128(12)))
			.returning(|_| {
				Ok(Some(Contribution {
					id: ContributionId::from_u128(12),
					onchain_id: String::from("22"),
					project_id: String::from("34"),
					contributor_id: None,
					title: None,
					description: None,
					status: ContributionStatus::Open,
					external_link: None,
					gate: 0,
					metadata: ContributionMetadata {
						difficulty: None,
						technology: None,
						duration: None,
						context: None,
						r#type: None,
					},
					validator: FieldElement::ZERO,
				}))
			});

		contribution_service
			.expect_unassign_contributor()
			.with(eq(String::from("22")))
			.returning(|_| Ok(()));

		let usecase = UnassignContribution::new_usecase_boxed(
			Arc::new(contribution_service),
			Arc::new(contribution_repository),
		);

		let result = usecase.send_unassign_request(ContributionId::from_u128(12));
		assert!(result.is_ok(), "{:?}", result.err().unwrap());
	}

	#[rstest]
	fn unassign_contribution_find_error(
		contribution_service: MockContributionService,
		mut contribution_repository: MockContributionRepository,
	) {
		contribution_repository
			.expect_find_by_id()
			.returning(|_| Err(ContributionRepositoryError::InvalidEntity(Box::new(Error))));

		let usecase = UnassignContribution::new_usecase_boxed(
			Arc::new(contribution_service),
			Arc::new(contribution_repository),
		);

		let result = usecase.send_unassign_request(ContributionId::from_u128(12));

		assert!(result.is_err());
		assert_eq!(
			"Contribution repository error",
			result.unwrap_err().to_string()
		);
	}

	#[rstest]
	fn unassign_contribution_not_found(
		contribution_service: MockContributionService,
		mut contribution_repository: MockContributionRepository,
	) {
		contribution_repository.expect_find_by_id().returning(|_| Ok(None));

		let usecase = UnassignContribution::new_usecase_boxed(
			Arc::new(contribution_service),
			Arc::new(contribution_repository),
		);

		let result = usecase.send_unassign_request(ContributionId::from_u128(12));

		assert!(result.is_err());
		assert_eq!(
			"Contribution repository error",
			result.unwrap_err().to_string()
		);
	}

	#[rstest]
	fn unassign_contribution_send_error(
		mut contribution_service: MockContributionService,
		mut contribution_repository: MockContributionRepository,
	) {
		contribution_repository
			.expect_find_by_id()
			.with(eq(ContributionId::from_u128(12)))
			.returning(|_| {
				Ok(Some(Contribution {
					id: ContributionId::from_u128(12),
					onchain_id: String::from("22"),
					project_id: String::from("34"),
					contributor_id: None,
					title: None,
					description: None,
					status: ContributionStatus::Open,
					external_link: None,
					gate: 0,
					metadata: ContributionMetadata {
						difficulty: None,
						technology: None,
						duration: None,
						context: None,
						r#type: None,
					},
					validator: FieldElement::ZERO,
				}))
			});

		contribution_service
			.expect_unassign_contributor()
			.with(eq(String::from("22")))
			.returning(|_| Err(ContributionServiceError::Infrastructure(Box::new(Error))));

		let usecase = UnassignContribution::new_usecase_boxed(
			Arc::new(contribution_service),
			Arc::new(contribution_repository),
		);

		let result = usecase.send_unassign_request(ContributionId::from_u128(12));

		assert!(result.is_err());
		assert_eq!(
			"Contribution service error",
			result.unwrap_err().to_string()
		);
	}
}
