import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Job from '../../components/Job/Job';
import JobForm from '../../components/Job/JobForm';
import jobService from '../../utils/jobService'
import { useHistory } from 'react-router-dom';


export default function HomePage() {
  const [error, setError] = useState('')
  const [jobs, setJobs] = useState(null)
  const [jobForm, setJobForm] = useState(false)
  const history = useHistory();

  useEffect(() => {
    jobIndex()
  }, [jobs])

  async function jobIndex() {
    try {
      const data = await jobService.getJobs();
      setJobs(data)
      // Route to wherever you want!
    } catch (err) {
      // Invalid user data (probably duplicate email)
      setError(err.message)
    }
  }
  async function handleSubmit(state) {
    try {
      await jobService.createJob(state);
      // Route to wherever you want!
      setJobForm(false)

    } catch (err) {
      // Invalid user data (probably duplicate email)
      setError(err.message)
    }
  }

  const addJob = () => {
    setJobForm(true)
  }


  const jobItems = jobs.jobs.map((job, index) => {
    return (<Job key={index} company={job.companyName} title={job.jobTitle} />)
  })



  return (
    <>
      {jobForm ? '' : <Header addJob={addJob} />}
      {jobItems}
      {jobForm ? <JobForm handleSubmit={handleSubmit} /> : ''}
    </>
  );
}
