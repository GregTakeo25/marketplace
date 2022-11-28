use crate::domain::Budget;
use infrastructure::database::{schema::budgets::dsl, Client};
use std::sync::Arc;

#[derive(DieselRepository, new)]
#[projection(Budget)]
#[table(dsl::budgets)]
#[id(dsl::id)]
pub struct Repository(Arc<Client>);
