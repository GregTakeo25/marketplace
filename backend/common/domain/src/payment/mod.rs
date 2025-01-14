mod receipt;
pub use receipt::{Id as ReceiptId, Receipt};

mod events;
pub use events::Event;

mod aggregate;
pub use aggregate::{Error, Payment, Status};

mod reason;
pub use reason::{Reason, WorkItem};

crate::create_new_id!(Id);
