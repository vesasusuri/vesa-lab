import React, { useEffect, useMemo, useState } from 'react';

import Navbar from '../../components/shared/navbar/Navbar';

import JobsHero from '../../components/pages/JobsHero/JobsHero';

import JobsFilters from '../../components/pages/JobsFilters/JobsFilters';

import JobsCards from '../../components/pages/JobsCards/JobsCards';

import Footer from '../../components/shared/footer/Footer';

import { filterJobListings, listJobListings, mapJobListing } from '../../../../api/jobsApi';

const JOBS_PER_PAGE = 6;

const Jobs = () => {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [typeFilters, setTypeFilters] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(1);

useEffect(() => {

    let cancelled = false;

const load = async () => {

      setLoading(true);

      setError('');

      try {

        const data = await listJobListings();

        if (!cancelled) {

          setJobs((data.jobs || []).map(mapJobListing));

        }

      } catch {

        if (!cancelled) setError('Could not load jobs. Please try again later.');

      } finally {

        if (!cancelled) setLoading(false);

      }

    };

load();

return () => {

      cancelled = true;

    };

  }, []);

const filteredJobs = useMemo(

    () => filterJobListings(jobs, { typeFilters, searchQuery }),

    [jobs, typeFilters, searchQuery],

  );

const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE) || 1;

useEffect(() => {

    setPage(1);

  }, [typeFilters, searchQuery]);

useEffect(() => {

    if (page > totalPages) {

      setPage(totalPages);

    }

  }, [page, totalPages]);

const handleTypeFilterToggle = (filter) => {

    if (filter === 'All Types') {

      setTypeFilters([]);

      return;

    }

setTypeFilters((prev) => (

      prev.includes(filter)

        ? prev.filter((item) => item !== filter)

        : [...prev, filter]

    ));

  };

  const handleTypeFilterSelect = (filter) => {
    if (filter === 'All Types') {
      setTypeFilters([]);
      return;
    }

    setTypeFilters([filter]);
  };

  const handleSearchChange = (value) => {

    setSearchQuery(value);

  };

return (

    <div className="jobs-page">

      <Navbar />

      <JobsHero

        searchQuery={searchQuery}

        onSearchChange={handleSearchChange}

        totalJobs={jobs.length}

        filteredCount={filteredJobs.length}

      />

      <JobsFilters

        activeFilters={typeFilters}

        onFilterToggle={handleTypeFilterToggle}
        onFilterSelect={handleTypeFilterSelect}

        totalJobs={jobs.length}

        filteredCount={filteredJobs.length}

        page={page}

        totalPages={totalPages}

        jobsPerPage={JOBS_PER_PAGE}

      />

      <JobsCards

        jobs={filteredJobs}

        loading={loading}

        error={error}

        page={page}

        onPageChange={setPage}

        jobsPerPage={JOBS_PER_PAGE}

      />

      <Footer />

    </div>

  );

};

export default Jobs;

