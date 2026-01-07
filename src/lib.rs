use wasm_bindgen::prelude::*;
use serde::Serialize;

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

#[wasm_bindgen]
pub fn parse_to_dnr(rule_text: &str, id: u32) -> JsValue {
    // Clean "||ads.com^" to "ads.com"
    let clean_filter = rule_text.replace("||", "").replace("^", "");

    let rule = DnrRule {
        id,
        priority: 1,
        action: Action { action_type: "block".to_string() },
        condition: Condition {
            url_filter: clean_filter,
            resource_types: vec!["main_frame".to_string(), "script".to_string()],
        },
    };

    serde_wasm_bindgen::to_value(&rule).unwrap()
}