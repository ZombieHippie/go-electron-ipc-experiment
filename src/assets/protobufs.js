
const fs = require('fs')
const path = require('path')

const proto_src_dir = path.resolve(__dirname, '../../')
const protobuf = require('protocol-buffers')
const getProto = function (basename) {
  var filepath = path.resolve(proto_src_dir, basename + '.proto')
  return protobuf(fs.readFileSync(filepath, 'utf8'))
}


module.exports = {
  math: getProto('mathoperation/mathoperation')
}
