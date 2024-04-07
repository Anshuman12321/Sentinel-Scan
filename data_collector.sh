#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <domain_list_file>"
    exit 1
fi

DOMAIN_LIST_FILE="$1"
OUTPUT_CSV="security_headers_report.csv"

echo "Website,CSP,X-Frame-Options,X-Content-Type-Options,HSTS,X-XSS-Protection,SSL_Config_Errors,Server_Version,Info_Exposure,HTTP_Methods,Email_Exposure,SecurityScore" > "$OUTPUT_CSV"

function check_headers_and_score() {
    local website=$1
    
    local headers=$(curl -sI "$website" | tr -d '\r' | tr -d '\0')
    local content=$(curl -sL "$website" | tr -d '\0')
    
    local score=0
    
    echo -n "$website," >> "$OUTPUT_CSV"
    for header in "Content-Security-Policy" "X-Frame-Options" "X-Content-Type-Options" "Strict-Transport-Security" "X-XSS-Protection"; do
        echo -n $(echo "$headers" | grep -q "$header" && echo "1" || echo "0")"," >> "$OUTPUT_CSV"
        [ $(echo "$headers" | grep -q "$header" && echo "1" || echo "0") -eq 1 ] && let score+=1
    done
    
    for feature in "SSL_Config_Errors" "Server_Version" "Info_Exposure" "HTTP_Methods" "Email_Exposure"; do
        echo -n $(echo "$content" | grep -q "$feature" && echo "1" || echo "0")"," >> "$OUTPUT_CSV"
        [ $(echo "$content" | grep -q "$feature" && echo "1" || echo "0") -eq 1 ] && let score+=1
    done
    
    echo "$score" >> "$OUTPUT_CSV"
}

while IFS= read -r domain; do
    check_headers_and_score "$domain"
done < "$DOMAIN_LIST_FILE"

echo "Security header checks complete. Results saved to $OUTPUT_CSV."
