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
  
  return job;
}

(async () => {
  const client = new Client({ config: config.getInCluster() })

  await client.loadSpec()

  const jobDefinition = prepareRunnerJob(job, id);
  await client.apis.batch.v1.namespaces('default').jobs.post({ body: jobDefinition })
})();
