// Be descriptive with titles here. The describe and it titles combined read like a sentence.
import {LiveStaffService} from "./staff/live";
import {AccessTokenService} from "../shared/aws/access.token.service";
import {inject} from "@angular/core/testing";
import {Staff} from "./staff/schema";
import {MockStaffService} from "./staff/mock";
import {TestUtils} from "../test";
import {LiveAccountService} from "./account/live";
import {Account} from "./account/schema";
import {RevvolveApp} from "../app/app.component";

describe('Service Tests', () => {
  let authResult = null;

  var originalTimeout;

  let login = (done: DoneFn) => {
    inject([AccessTokenService], (tokenSvc: AccessTokenService) => {
      tokenSvc.startNewSession('celeron', 'passWord@1', (result, err) => {
        authResult = result;
        if (result) {
          done();
        } else {
          done.fail(err);
        }
      })
    })();

  }
  beforeEach((done)=> {
    TestUtils.beforeEachCompiler([RevvolveApp]);

    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    login(done);
  })

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('has a dummy spec to test 2 + 2', function(done) {
    // An intentionally failing test. No code within expect() will never equal 4.
    expect(4).toEqual(4);
    done();
    //expect(authResult).toBeDefined();
  });

  it('Get Mock Staff', (done: DoneFn)=> {

    inject([MockStaffService], (staffSvc: MockStaffService) => {
      staffSvc.list().then((staffs: Staff[]) => {
        expect(staffs.length).toBeGreaterThan(0);
        done();
      }).catch((err: any)=> {fail(err)})
    })();
  });

  it('Get Live Staff', (done: DoneFn)=> {
    inject([LiveStaffService], (staffSvc: LiveStaffService) => {
      staffSvc.list().then((staffs: Staff[]) => {
        expect(staffs).toBeDefined();
        done();
      }).catch((err: any)=> {fail(err)})
    })();
  });

  let currentAccount: Account;

  it('Get Live Customer', (done: DoneFn)=> {
    inject([LiveAccountService], (svc: LiveAccountService) => {
      svc.get("TESTCUST").then((account: Account) => {
        expect(account).toBeDefined();
        expect(account.customerId).toEqual("TESTCUST");
        expect(account.properties.logo).toBeDefined();
        currentAccount = account;
        done();
      }).catch((err: any)=> {fail(err)})
    })();
  });

  it('Modify Live Customer', (done: DoneFn)=> {
    currentAccount.properties.verticalId = "Small Orthodontic Clinic";
    inject([LiveAccountService], (svc: LiveAccountService) => {
      svc.update(currentAccount).then((account: Account) => {
        expect(account == currentAccount).isNot;
        expect(account).toBeDefined();
        expect(account.lockingVersion).toBeDefined();
        expect(account.properties.verticalId).toEqual(currentAccount.properties.verticalId);
        expect(account.properties.logo).toBeDefined();
        done();
      }).catch((err: any)=> {fail(err)})
    })();
  });

});
