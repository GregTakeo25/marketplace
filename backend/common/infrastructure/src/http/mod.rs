use anyhow::Result;

mod config;
pub use config::Config;
use reqwest::header::{HeaderMap, HeaderName};
use url::Url;

pub struct Client {
	client: reqwest::Client,
	base_url: String,
}

impl Client {
	pub fn new(config: Config, mut default_headers: HeaderMap) -> Result<Self> {
		for (name, value) in config.headers.into_iter() {
			default_headers.append(HeaderName::from_bytes(name.as_bytes())?, value.try_into()?);
		}

		Ok(Self {
			client: reqwest::ClientBuilder::new().default_headers(default_headers).build()?,
			base_url: config.base_url,
		})
	}

	fn url(&self, path: String) -> Result<Url> {
		let url = format!("{}/{path}", self.base_url).parse()?;
		Ok(url)
	}

	pub async fn post(&self, path: String) -> Result<()> {
		self.client.post(self.url(path)?).send().await?.error_for_status()?;
		Ok(())
	}
}
