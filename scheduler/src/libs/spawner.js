const yaml = require('yamljs');
const uuid = require('short-uuid');
const k8s = require('kubernetes-client');

const client = new k8s.Client({ config: k8s.config.getInCluster() });
const job = yaml.load(__dirname + '/../../kubernetes/runner-job.yaml');

function prepareRunnerJob(jobTemplate, id) {
  const job = JSON.parse(JSON.stringify(jobTemplate));

  job.metadata.name += `-${id}`.toLowerCase();
  job.metadata.labels.runner = id;
  job.spec.template.metadata.runner = id;

  return job;
}

async function spawnRunner() {
  await client.loadSpec();

  const id = uuid.generate();
  const jobDefinition = prepareRunnerJob(job, id);
  const result = await client.apis.batch.v1.namespaces('fushigi').jobs.post({ body: jobDefinition })
}

module.exports = {
  spawnRunner,
}
