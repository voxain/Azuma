use serde_derive::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct ErrorBody {
    pub error: String,
}
