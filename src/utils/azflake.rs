use lazy_static::lazy_static;
use std::{
    sync::atomic::{AtomicU64, Ordering},
    thread,
    time::{Duration, SystemTime},
};

// counter for azflakes
lazy_static! {
    static ref AZFLAKES_COUNTER: AtomicU64 = AtomicU64::new(0);
    static ref AZFLAKE_LAST_SEC: AtomicU64 = AtomicU64::new(0);
}

// azflakes (azumaflakes) are like
// twitter snowflakes
// 40 bits timestamp, seconds since 01.01.2019
// 12 bits increasing counter, restarts every millisecond
// 12 bits process id
pub struct AzFlake {
    pub id: u64,
}

impl AzFlake {
    pub fn new(process_id: u64) -> Self {
        // has to be mutable so it's updateable later
        let mut timestamp = get_timestamp_in_secs();

        loop {
            if timestamp > AZFLAKE_LAST_SEC.load(Ordering::SeqCst) {
                AZFLAKE_LAST_SEC.store(timestamp, Ordering::SeqCst);
                AZFLAKES_COUNTER.store(0, Ordering::SeqCst);
                break;
            } else {
                if AZFLAKES_COUNTER.load(Ordering::SeqCst) < 4096 {
                    break;
                } else {
                    thread::sleep(Duration::from_secs(1));
                    timestamp = get_timestamp_in_secs();
                }
            }
        }

        let counter = AZFLAKES_COUNTER.load(Ordering::SeqCst);
        let result = timestamp.wrapping_shl(24) + counter.wrapping_shl(12) + process_id;
        AZFLAKES_COUNTER.fetch_add(1, Ordering::SeqCst);
        Self { id: result }
    }
}

fn get_timestamp_in_secs() -> u64 {
    loop {
        match SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH + Duration::new(1546300800, 0))
        {
            Ok(n) => {
                break n.as_secs();
            }

            Err(_) => {
                println!("Time rolled back, waiting.");
                thread::sleep(Duration::from_secs(1));
            }
        }
    }
}
