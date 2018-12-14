const yaml = require('yamljs');
const uuid = require('short-uuid');
const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config
const { scheduler } = require('./grpc/server');
 
const job = yaml.load(__dirname + '/../kubernetes/runner-job.yaml');

scheduler.start();
console.log('Scheduler grpc server is up');

const id = uuid.generate();
function prepareRunnerJob(jobTemplate, id) {
  const job = JSON.parse(JSON.stringify(jobTemplate));

  job.metadata.name += `-${id}`.toLowerCase();
  job.metadata.labels.runner = id;
  job.spec.template.metadata.runner = id;

  console.log('Job manifest', JSON.stringify(job, null, 2));
  
  return job;
}

setTimeout((async () => {
  const client = new Client({ config: config.getInCluster() })

  await client.loadSpec()

  const jobDefinition = prepareRunnerJob(job, id);
  const result = await client.apis.batch.v1.namespaces('fushigi').jobs.post({ body: jobDefinition })


  console.log('RESULT', result)
}), 5000);
