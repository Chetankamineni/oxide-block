use wasm_bindgen::prelude::*;
use serde::Serialize;

// Structure for Chrome's Declarative Net Request (DNR) API
#[derive(Serialize)]
struct DnrRule {
    id: u32,
    priority: u32,
    action: Action,
    condition: Condition,
}

#[derive(Serialize)]
struct Action {
    #[serde(rename = "type")]
    action_type: String,
}

#[derive(Serialize)]
struct Condition {
    #[serde(rename = "urlFilter")]
    url_filter: String,
    #[serde(rename = "resourceTypes")]
    resource_types: Vec<String>,
}

#[derive(Serialize)]
pub struct HistoricalStats {
    pub labels: Vec<String>,
    pub dataset: Vec<u32>,
}

#[wasm_bindgen]
pub fn parse_bulk_rules(raw_data: &str, starting_id: u32) -> JsValue {
    let mut current_id = starting_id;
    
    // Efficiently filter and transform lines into DNR JSON objects
    let rules: Vec<DnrRule> = raw_data
        .lines()
        .filter(|line| !line.is_empty() && !line.starts_with('!') && !line.starts_with('#'))
        .filter(|line| !line.contains("##")) // Ignore cosmetic rules here
        .map(|line| {
            let clean_filter = line.replace("||", "").replace("^", "");
            let rule = DnrRule {
                id: current_id,
                priority: 1,
                action: Action { action_type: "block".to_string() },
                condition: Condition {
                    url_filter: clean_filter,
                    resource_types: vec!["script".to_string(), "image".to_string(), "sub_frame".to_string()],
                },
            };
            current_id += 1;
            rule
        })
        .collect();

    serde_wasm_bindgen::to_value(&rules).unwrap()
}

#[wasm_bindgen]
pub fn generate_cosmetic_css(raw_data: &str) -> String {
    let mut css_output = String::new();

    // Find rules containing '##' (the standard cosmetic filter syntax)
    for line in raw_data.lines() {
        if line.contains("##") {
            let parts: Vec<&str> = line.split("##").collect();
            if parts.len() == 2 {
                // Example: ads.com##.banner -> .banner { display: none !important; }
                css_output.push_str(parts[1]);
                css_output.push_str(" { display: none !important; }\n");
            }
        }
    }
    css_output
}

#[wasm_bindgen] 
pub fn get_historical_metrics() -> JsValue{
    let historical_data = HistoricalStats{
        labels: vec![
            "Sat".to_string(),
            "Sun".to_string(),
            "Mon".to_string(),
            "Tue".to_string(),
            "Wed".to_string(),
            "Thu".to_string(),
            "Fri".to_string(),
        ],
        dataset: vec![1200, 2100, 1800, 900, 1100, 1600, 150], 
    };

    serde_wasm_bindgen::to_value(&historical_data).unwrap()
}