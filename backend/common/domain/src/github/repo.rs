use derive_more::{AsRef, Display, From, Into};
use diesel_derive_newtype::DieselNewType;
use juniper::{GraphQLObject, ParseScalarResult, ParseScalarValue, Value};
use serde::{Deserialize, Serialize};
use url::Url;

#[allow(clippy::too_many_arguments)]
#[derive(Debug, GraphQLObject, Clone, Serialize, Deserialize, Hash, PartialEq, Eq)]
pub struct Repo {
	pub id: Id,
	pub owner: String,
	pub name: String,
	pub logo_url: Url,
	pub html_url: Url,
	pub description: String,
	pub stars: i32,
	pub forks_count: i32,
}

#[derive(
	Debug,
	Clone,
	Copy,
	Default,
	Serialize,
	Deserialize,
	PartialEq,
	Eq,
	Display,
	From,
	Into,
	AsRef,
	Hash,
	DieselNewType,
)]
pub struct Id(i64);

impl From<u64> for Id {
	fn from(value: u64) -> Self {
		(value as i64).into()
	}
}

#[juniper::graphql_scalar(
	name = "GithubRepoId",
	description = "A GitHub repository ID, represented as an integer"
)]
impl<S> GraphQLScalar for Id
where
	S: ScalarValue,
{
	fn resolve(&self) -> Value {
		Value::scalar::<i32>(
			self.0.try_into().expect("Inner repository id is not a valid 32-bits integer"),
		)
	}

	fn from_input_value(value: &InputValue) -> Option<Self> {
		value.as_int_value().map(|x| Self(x as i64))
	}

	fn from_str<'a>(value: ScalarToken<'a>) -> ParseScalarResult<'a, S> {
		<i32 as ParseScalarValue<S>>::from_str(value)
	}
}
