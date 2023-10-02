const express = require('express');
const axios = require('axios');
const lodash = require('lodash');
const path = require("path");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.get('/api/blog-stats', async (req, res) => {
    try {
        const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
        const adminSecret = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';


        const response = await axios.get(apiUrl, {
            headers: {
                'x-hasura-admin-secret': adminSecret,
            },
        });

        const blogStats = response.data;
        const totalBlogs = lodash.size(blogStats.blogs);
        const blogWithLongestTitle = lodash.maxBy(blogStats.blogs, 'title.length');
        const blogsWithPrivacy = lodash.filter(blogStats.blogs, blog =>
            lodash.includes(blog.title.toLowerCase(), 'privacy')
        );
        const numberOfBlogsWithPrivacy = lodash.size(blogsWithPrivacy);
        const uniqueBlogTitles = lodash.uniqBy(blogStats.blogs, 'title').map(blog => blog.title);


        const jsonData = {
            total_no_of_blogs: totalBlogs,
            blog_with_longest_title: blogWithLongestTitle,
            blogs_with_word_privacy: numberOfBlogsWithPrivacy,
            unique_blogs_array: uniqueBlogTitles,
        };
        res.json(jsonData);
    }
    catch (error) {

        console.error('Error fetching blog data:', error);
        res.status(500).json({ error: 'Unable to fetch blog data' });
    }
});
app.get("/api/blog-search", async (req, res) => {
    let query = req.query.query;
    console.log(query);
    try {
        const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
        const adminSecret = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';


        const response = await axios.get(apiUrl, {
            headers: {
                'x-hasura-admin-secret': adminSecret,
            },
        });

        const blogStats = response.data;
        const result = lodash.filter(blogStats.blogs, blog =>
            lodash.includes(blog.title.toLowerCase(), query)
        );
        res.render("index.ejs", { result });
    }
    catch (error) {

        console.error('Error fetching blog data:', error);
        res.status(500).json({ error: 'Unable to fetch blog data' });
    }

})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
