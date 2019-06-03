use actix_web::{
    middleware::{Middleware, Started},
    HttpRequest, Result,
};

// Enum for Authorization Information
enum AuthInfo {
    NotLoggedIn,
    LoggedIn,
}


// This middleware checks if there is an auth cookie,
// and if there is one, it validates it.
// After that, Authorization Information gets
// injected into the request and the request
// gets passed along to the next middleware/function.
pub struct AuthMiddleware;

impl<S> Middleware<S> for AuthMiddleware {
    fn start(&self, req: &HttpRequest<S>) -> Result<Started> {
        req.extensions_mut().insert(AuthInfo::NotLoggedIn);
        Ok(Started::Done)
    }
}