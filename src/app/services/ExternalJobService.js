const axios = require("axios");

module.exports.fetchExternalJobs = async function (
  page = 1,
  limit = 10,
  keyword,
  location
) {
  const query = `${keyword} ${location || ""}`.trim();

  try {
    console.log(`🌐 Buscando vagas da JSearch API para: "${query}"`);
    console.log("🔑 RAPIDAPI_KEY carregada?", !!process.env.RAPIDAPI_KEY);

    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: {
        query,
        page: page.toString(),
        num_pages: 1,
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
      timeout: 15000,
    });

    const allJobs = response.data.data || [];

    const normalized = allJobs.map((job) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      imageUrl: job.employer_logo || "https://via.placeholder.com/60",
      cityState: job.job_city || job.job_country || "Remoto",
      type: job.job_employment_type || "Não informado",
      description: job.job_description,
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
    console.error("❌ Erro ao buscar vagas externas (JSearch):", error.message);

    if (error.response) {
      console.error("Código HTTP:", error.response.status);
      console.error("Resposta da API:", error.response.data);
    }

    throw new Error("Falha ao buscar vagas externas");
  }
};

module.exports.fetchJobDetails = async function (jobId) {
  try {
    console.log(`🌐 Buscando detalhes da vaga JSearch ID: ${jobId}`);

    const response = await axios.get(
      "https://jsearch.p.rapidapi.com/job-details",
      {
        params: {
          job_id: jobId,
          extended_publisher_details: "false",
        },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
        timeout: 10000,
      }
    );

    if (response.data?.data?.length > 0) {
      return response.data.data[0];
    } else {
      throw new Error("Vaga não encontrada na JSearch");
    }
  } catch (error) {
    console.error("❌ Erro ao buscar detalhes da vaga externa:", error.message);

    if (error.response) {
      console.error("Código HTTP:", error.response.status);
      console.error("Detalhes:", error.response.data);
    }

    throw new Error("Falha ao buscar detalhes da vaga externa");
  }
};
