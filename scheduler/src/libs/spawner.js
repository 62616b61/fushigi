const yaml = require('yamljs');
const uuid = require('short-uuid');
const k8s = require('kubernetes-client');

const client = new k8s.Client({ config: k8s.config.getInCluster() });

const jobTemplate = yaml.load(__dirname + '/../../kubernetes/runner-job.yaml');
const serviceTemplate = yaml.load(__dirname + '/../../kubernetes/runner-service.yaml');

function prepareRunnerService(id) {
  const service = JSON.parse(JSON.stringify(serviceTemplate));

  service.metadata.name += `-${id}`.toLowerCase();
  service.metadata.labels.runner = id;
  service.spec.selector.runner = id;

  console.log('SERVICE MANIFEST', service);

  return service;
}

function prepareRunnerJob(id) {
  const job = JSON.parse(JSON.stringify(jobTemplate));

  job.metadata.name += `-${id}`.toLowerCase();
  job.metadata.labels.runner = id;
  job.spec.template.metadata.runner = id;

  return job;
}

async function spawnRunner() {
  await client.loadSpec();

  const id = uuid.generate();
  const jobDefinition = prepareRunnerJob(id);
  const serviceDefinition = prepareRunnerService(id);

  const result = Promise.all([
    await client.apis.batch.v1.namespaces('fushigi').jobs.post({ body: jobDefinition }),
    await client.apis.v1.namespaces('fushigi').services.post({ body: serviceDefinition }),
  ]);
}

module.exports = {
  spawnRunner,
}
