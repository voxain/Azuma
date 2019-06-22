use crate::utils::azflake::AzFlake;

// UserIds are a Unix Timestamp and a random 6-Digit number
// separated by a plus
pub type UserId = AzFlake;

// Groups a User can be in, in the order
// the badges are displayed
pub enum UserGroup {
    Administrator,
    EarlyAccess,
}

// States a user can have,
// only one at a time possible
pub enum UserState {
    Online,
    Away,
    DoNotDisturb,
    Offline,
}

// User
pub struct User {
    user_id: UserId,
    username: String,
    password: String,
    user_groups: Vec<UserGroup>,
    status: UserState,
}
