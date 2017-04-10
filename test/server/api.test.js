import chai from 'chai'
import * as chaihttp from 'chai-http'
import config from './server/config'

chai.use(chaihttp)

describe('/GET videos', () => {
    it('It should GET all videos from DB', (done) => {
        chai.request('http://localhost:3000')
          .get('/videos')
          .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.an('object')
              res.body.length.should.be.eql(1)
              done()
          })
    })
})

//TODO
describe('/POST eroapi', () => { 
    it("It should not POST if videoId is not 8 length", (done) => {
        let eroJson = ["123456789", "abcdefghi", "qwerasdfzxcv"]

        chai.request('http://localhost:3000')
          .post('/eroapi')
          .send(eroJson)
          .end((err, res) => {
              expect(res).to.have.status(200)
              expect(res.body).to.be.an('object')
              expect(res.body).to.have.property('errors')
              expect(res.body).to.have.any.keys('length')
              res.body.length.should.be.eql(1)
              done()
          })
    })

    it("It should not Post if eroJson is empty", (done) => {
        let eroJson = []

        chai.request('http://localhost:3000')
          .post('/eroapi')
          .send(eroJson)
          .end((err, res) => {
              expect(res).to.have.status(200)
              expect(res.body).to.be.an('object')
              expect(res.body).to.have.property('errors')
              expect(res.body).to.have.any.keys('empty')
              res.body.length.should.be.eql(1)
              done()
          })
    })
})