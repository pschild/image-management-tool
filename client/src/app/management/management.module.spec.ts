import { ManagementModule } from './management.module';

describe('ManagementModule', () => {
  let managementModule: ManagementModule;

  beforeEach(() => {
    managementModule = new ManagementModule();
  });

  it('should create an instance', () => {
    expect(managementModule).toBeTruthy();
  });
});
