const yaml = require('yamljs');
const uuid = require('short-uuid');
const k8s = require('kubernetes-client');

const istioVirtualServiceCRD = yaml.load(__dirname + '/../../kubernetes/istio-virtual-service-crd.yaml');
const jobTemplate = yaml.load(__dirname + '/../../kubernetes/runner-job.yaml');
const serviceTemplate = yaml.load(__dirname + '/../../kubernetes/runner-service.yaml');
const virtualServiceTemplate = yaml.load(__dirname + '/../../kubernetes/runner-virtual-service.yaml');

const client = new k8s.Client({ config: k8s.config.getInCluster() });
client.addCustomResourceDefinition(istioVirtualServiceCRD);

function prepareRunnerJob(id) {
  const job = JSON.parse(JSON.stringify(jobTemplate));

  job.metadata.name += `-${id}`.toLowerCase();
  job.metadata.labels.runner = id;
  job.spec.template.metadata.runner = id;

  return job;
}

function prepareRunnerService(id) {
  const service = JSON.parse(JSON.stringify(serviceTemplate));

  service.metadata.name += `-${id}`.toLowerCase();
  service.metadata.labels.runner = id;
  service.spec.selector.runner = id;

  return service;
}

function prepareRunnerVirtualService(id) {
  const virtualService = JSON.parse(JSON.stringify(virtualServiceTemplate));

  virtualService.metadata.name += `-${id}`.toLowerCase();
  virtualService.spec.hosts[0] += `-${id}`;
  virtualService.spec.http[0].route[0].destination.host += `-${id}`;

  return virtualService;
}

async function spawnRunner() {
  await client.loadSpec();

  const id = uuid.generate();
  const jobDefinition = prepareRunnerJob(id);
  const serviceDefinition = prepareRunnerService(id);
  const VirtualServiceDefinition = prepareRunnerVirtualService(id);

  const result = Promise.all([
    await client.apis.batch.v1.namespaces('fushigi').jobs.post({ body: jobDefinition }),
    await client.apis.v1.namespaces('fushigi').services.post({ body: serviceDefinition }),
    await client.apis['networking.istio.io'].v1alpha3.namespaces('fushigi').virtualservices.post({ body: VirtualServiceDefinition }),
  ]);
}

module.exports = {
  spawnRunner,
}
