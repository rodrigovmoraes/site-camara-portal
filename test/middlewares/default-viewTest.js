const expect = require('chai').expect;

describe("Middlewares", function() {

describe("defaultViewMiddleware", function() {
   var fsMock;
   var reqMock;
   var resMock;
   var defaultViewMiddlewareFactory;

   beforeEach(function() {
      defaultViewMiddlewareFactory = require("../../middlewares/default-view.js");
      fsMock = {
                  _statPath: "",
                  _statCount: 0,
                  stat: function(path, callback) {
                           this._statCount++;
                           this._statPath = path;
                           callback(undefined, {});
                        }
               };
      fsMockFileDoesntExist = {
                  _statPath: "",
                  _statCount: 0,
                  stat: function(path, callback) {
                           this._statCount++;
                           this._statPath = path;
                           callback({message: 'error'}, {});
                        }
               };
      reqMock = {
                  path: ""
                } ;
      resMock = {
                  _renderPath: "",
                  _renderCount: 0,
                  render: function(path) {
                     this._renderPath = path;
                     this._renderCount++;
                  }
                };
      nextMock = {
                     _count: 0,
                     _next: function(){
                        this._count++;
                     }
                 };
      nextMockFunction = function() {
                           nextMock._next.apply(nextMock);
                        };

   });

  it("File exist, path starting with slash [/folder/teste.html]", function() {
     defaultViewMiddlewareFactory._setFs(fsMock);
     var defaultViewMiddleware = defaultViewMiddlewareFactory('./views');
     reqMock.path = "/folder/teste.html";

     defaultViewMiddleware(reqMock, resMock, nextMockFunction);
     expect(fsMock._statCount).to.equal(1);
     expect(fsMock._statPath).to.equal('./views/folder/teste.html');
     expect(resMock._renderCount).to.equal(1);
     expect(resMock._renderPath).to.equal('folder/teste.html');
     expect(nextMock._count).to.equal(0);
  });

  it("File exist, path starting and ending with spaces [  /folder/subfolder/teste.html  ]", function() {
     defaultViewMiddlewareFactory._setFs(fsMock);
     var defaultViewMiddleware = defaultViewMiddlewareFactory('./views');
     reqMock.path = "  /folder/subfolder/teste.html  ";

     defaultViewMiddleware(reqMock, resMock, nextMockFunction);
     expect(fsMock._statCount).to.equal(1);
     expect(fsMock._statPath).to.equal('./views/folder/subfolder/teste.html');
     expect(resMock._renderCount).to.equal(1);
     expect(resMock._renderPath).to.equal('folder/subfolder/teste.html');
     expect(nextMock._count).to.equal(0);
  });

  it("File doesn't exist", function() {
     defaultViewMiddlewareFactory._setFs(fsMockFileDoesntExist);
     var defaultViewMiddleware = defaultViewMiddlewareFactory('./views');
     reqMock.path = "  /folder/test2e.html  ";

     defaultViewMiddleware(reqMock, resMock, nextMockFunction);
     expect(fsMockFileDoesntExist._statCount).to.equal(1);
     expect(fsMockFileDoesntExist._statPath).to.equal('./views/folder/test2e.html');
     expect(resMock._renderCount).to.equal(0);
     expect(nextMock._count).to.equal(1);
  });

  it("File is not a html file", function() {
     defaultViewMiddlewareFactory._setFs(fsMock);
     var defaultViewMiddleware = defaultViewMiddlewareFactory('./views');
     reqMock.path = "  /folder/teste.pdf  ";

     defaultViewMiddleware(reqMock, resMock, nextMockFunction);
     expect(fsMock._statCount).to.equal(0);
     expect(resMock._renderCount).to.equal(0);
     expect(nextMock._count).to.equal(1);
  });

  it("Undefined req.path", function() {
     defaultViewMiddlewareFactory._setFs(fsMock);
     var defaultViewMiddleware = defaultViewMiddlewareFactory('./views');
     reqMock.path = undefined;

     defaultViewMiddleware(reqMock, resMock, nextMockFunction);
     expect(fsMock._statCount).to.equal(0);
     expect(resMock._renderCount).to.equal(0);
     expect(nextMock._count).to.equal(1);
  });

});

});
