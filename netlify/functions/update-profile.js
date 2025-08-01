const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");
    const { userId, firstName, lastName, organization } = data;

    console.log("Payload:", data);

    const tokenRes = await fetch("https://dev-bm83wa86bo4gmb4.us.auth0.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_M2M_CLIENT_ID,
        client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
        audience: "https://dev-bm83wa86bo4gmb4.us.auth0.com/api/v2/",
        grant_type: "client_credentials"
      })
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error("Token error:", tokenJson);
      return { statusCode: 500, body: JSON.stringify({ error: "Token request failed", details: tokenJson }) };
    }

    const accessToken = tokenJson.access_token;
    const patchRes = await fetch(`https://dev-bm83wa86bo4gmb4.us.auth0.com/api/v2/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        given_name: firstName,
        family_name: lastName,
        user_metadata: { organization }
      })
    });

    const patchJson = await patchRes.json();
    if (!patchRes.ok) {
      console.error("Patch error:", patchJson);
      return { statusCode: patchRes.status, body: JSON.stringify(patchJson) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

