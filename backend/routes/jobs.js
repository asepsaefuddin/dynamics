const express = require('express');
const router = express.Router();

const jobs = require('../data/jobs');

// POST /jobs
router.post('/', (req, res) => {

  const { name, jobPosition, category } = req.body;

  if (!name || !jobPosition || !category) {
    return res.status(400).json({
      message: 'name, jobPosition, and category are required',
    });
  }

  const newJob = {
    id: Date.now().toString(),
    name,
    jobPosition,
    category,
    createdAt: new Date().toISOString(),
  };

  jobs.push(newJob);

  res.status(201).json({
    message: 'Job created successfully',
    data: newJob,
  });
});

// /job
router.get('/', (req, res) => {
  const {
    search = '',
    category,
    sort = 'latest',
    page = 1,
    limit = 10,
  } = req.query;

  let result = [...jobs];

  if (search) {
  const keyword = search.toLowerCase();
  result = result.filter((job) =>
    job.name.toLowerCase().includes(keyword) ||
    job.jobPosition.toLowerCase().includes(keyword) ||
    job.category.toLowerCase().includes(keyword)
  );
}

  if (category) {
    result = result.filter((job) => job.category === category);
  }

  if (sort === 'latest') {
    result.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (sort === 'oldest') {
    result.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else if (sort === 'az') {
    result.sort((a, b) =>
      a.jobPosition.localeCompare(b.jobPosition)
    );
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;

  const paginatedData = result.slice(startIndex, endIndex);
  const hasMore = endIndex < result.length;

  res.json({
    data: paginatedData,
    nextPage: hasMore ? pageNumber + 1 : null,
    hasMore,
  });
});

// by id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const job = jobs.find((job) => job.id === id);

  if (!job) {
    return res.status(404).json({
      message: 'Job not found',
    });
  }

  res.json({
    data: job,
  });
});


module.exports = router;
