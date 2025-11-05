// src/app/services/ExternalJobService.js
const axios = require("axios");

async function fetchExternalJobs(page = 1, limit = 10) {
  try {
    console.log("🌐 Buscando vagas da JSearch API...");
    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: {
        query: "developer",
        page: page.toString(),
        num_pages: 1,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      timeout: 15000,
    });

    const allJobs = response.data.data || [];

    const normalized = allJobs.map((job) => ({
      title: job.job_title,
      company: job.employer_name,
      description: job.job_description,
      location: job.job_city || job.job_country || "Remote",
      salary: job.job_salary_currency || "N/A",
      tags: [job.job_employment_type, "JSearch"],
      externalLink: job.job_apply_link,
      source: "JSearch API",
    }));

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = normalized.slice(start, end);

    return {
      total: normalized.length,
      page: Number(page),
      limit: Number(limit),
      data: paginated,
    };
  } catch (error) {
    console.error("Erro ao buscar vagas externas:", error.message);
    if (error.response) {
      console.error("Código HTTP:", error.response.status);
      console.error("Corpo:", error.response.data);
    }
    throw new Error("Falha ao buscar vagas externas");
  }
}

module.exports = { fetchExternalJobs };
