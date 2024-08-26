from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import openai
import re
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()

# Get OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")


# MySQL connection
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
    )


@app.route("/nl2sql", methods=["POST"])
def nl2sql():
    natural_language_query = request.json["query"]

    # Get database schema
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()

    schema = []
    for table in tables:
        table_name = table[0]
        cursor.execute(f"DESCRIBE {table_name}")
        columns = cursor.fetchall()
        schema.append(f"Table: {table_name}")
        schema.append("Columns:")
        for column in columns:
            schema.append(f"  - {column[0]}: {column[1]}")

    schema_str = "\n".join(schema)

    # Generate SQL query using OpenAI
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a SQL query generator. Given the following schema and a natural language query, generate a valid MySQL query.\n\nSchema:\n{schema_str}",
            },
            {"role": "user", "content": natural_language_query},
        ],
    )

    generated_query = response.choices[0].message["content"].strip()

    # Check for potentially dangerous SQL statements
    if re.search(r"\b(drop|truncate|alter|delete)\b", generated_query, re.IGNORECASE):
        return jsonify({"error": "Unsafe SQL query detected. Operation aborted."}), 400

    # Execute the generated query
    try:
        cursor.execute(generated_query)
        result = cursor.fetchall()
        column_names = [i[0] for i in cursor.description]

        # Format the result as a list of dictionaries
        formatted_result = [dict(zip(column_names, row)) for row in result]

        return jsonify({"query": generated_query, "result": formatted_result})
    except Exception as e:
        return jsonify({"query": generated_query, "error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    app.run(debug=True)
