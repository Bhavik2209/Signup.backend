const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const { fName, lName, email } = req.body;
    console.log(fName, lName, email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName,
                },
            },
        ],
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/41ed835776";

    const options = {
        method: "POST",
        auth: "bhavik:c0ba1e779422b98bf7ad19157b3bb480-us21"
    };


    const request = https.request(url, options, (response) => {
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        let data = "";
        response.on("data", (chunk) => {
            data += chunk;
        });

        response.on("end", () => {
            console.log(JSON.parse(data));// Adjust the response as needed
        });
    });
    request.write(jsonData);
    request.end();
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
