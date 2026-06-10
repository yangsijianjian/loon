const token = $prefs.valueForKey("sliverkiss_github_token");

(async () => {
    // 构造 Raw URL
    const req = {
        url: `https://raw.githubusercontent.com${$request.path}`,
        method: "GET",
        headers: {
            "Authorization": `token ${token}`,
        }
    };

    $task.fetch(req).then((response) => {
        $done({
            status: `HTTP/1.1 200 OK`,
            headers: {
                "Content-Type": response.headers["Content-Type"] || "text/plain"
            },
            body: response?.body
        });
    })

})();