"use strict";
var RedSphere;
(function () {
    var makeData;
    makeData = (function () {
        var thetaEnd;
        var ix, iy;
        var index
        var grid = [];
        var a, b, c, d;
        var tType;
        var vertex = new Float32Array([0, 0, 0])
        var normal = new Float32Array([0, 0, 0])
        return function (redGL, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {

            radius = radius || 1;
            widthSegments = Math.max(3, Math.floor(widthSegments) || 8);
            heightSegments = Math.max(2, Math.floor(heightSegments) || 6);
            phiStart = phiStart !== undefined ? phiStart : 0;
            phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;
            thetaStart = thetaStart !== undefined ? thetaStart : 0;
            thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

            thetaEnd = thetaStart + thetaLength;
            ix, iy;
            index = 0;
            grid.length = 0
            vertex[0] = 0, vertex[1] = 0, vertex[2] = 0
            normal[0] = 0, normal[1] = 0, normal[2] = 0

            // TODO: 중복방지
            // 기존에 생성된 녀석이면 생성된 프리미티브 정보를 넘긴다.
            tType = 'RedSphere' + '_' + radius + '_' + widthSegments + '_' + heightSegments + '_' + phiStart + '_' + phiLength + '_' + thetaStart + '_' + thetaLength
            console.log(tType)

            ////////////////////////////////////////////////////////////////////////////
            // 데이터 생성!

            // buffers Data
            var interleaveData = [];
            var indexData = [];
            // generate vertices, normals and uvs
            for (iy = 0; iy <= heightSegments; iy++) {
                var verticesRow = [];
                var v = iy / heightSegments;
                for (ix = 0; ix <= widthSegments; ix++) {
                    var u = ix / widthSegments;
                    // vertex
                    vertex.x = - radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                    vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    interleaveData.push(vertex.x, vertex.y, vertex.z);
                    // normal
                    normal[0] = vertex.x
                    normal[1] = vertex.y
                    normal[2] = vertex.z
                    vec3.normalize(normal, normal)
                    interleaveData.push(normal[0], normal[1], normal[2]);
                    // uv
                    interleaveData.push(u, 1 - v);
                    verticesRow.push(index++);
                }
                grid.push(verticesRow);
            }
            // indices
            for (iy = 0; iy < heightSegments; iy++) {
                for (ix = 0; ix < widthSegments; ix++) {
                    a = grid[iy][ix + 1]
                    b = grid[iy][ix]
                    c = grid[iy + 1][ix]
                    d = grid[iy + 1][ix + 1]
                    if (iy !== 0 || thetaStart > 0) indexData.push(a, b, d)
                    if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indexData.push(b, c, d)
                }
            }
            ////////////////////////////////////////////////////////////////////////////
            // console.log(redGL['__datas']['RedPrimitive'])
            return {
                interleaveData: interleaveData,
                indexData: indexData,
                type: tType,
                interleaveBuffer: RedBuffer(
                    redGL,
                    tType + '_interleaveBuffer',
                    new Float32Array(interleaveData),
                    RedBuffer.ARRAY_BUFFER, [{
                        attributeKey: 'aVertexPosition',
                        size: 3,
                        normalize: false
                    },
                    {
                        attributeKey: 'aVertexNormal',
                        size: 3,
                        normalize: false
                    },
                    {
                        attributeKey: 'aTexcoord',
                        size: 2,
                        normalize: false
                    }
                    ]
                ),
                indexBuffer: RedBuffer(
                    redGL,
                    tType + '_indexBuffer',
                    new Uint16Array(indexData),
                    RedBuffer.ELEMENT_ARRAY_BUFFER
                )
            }
        }
    })();
    RedSphere = function (redGL, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
        if (!(this instanceof RedSphere)) return new RedSphere(redGL, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
        if (!(redGL instanceof RedGL)) throw 'RedPrimitive : RedGL 인스턴스만 허용됩니다.'
        /**DOC:
            {
                code : 'PROPERTY',
                title :`interleaveBuffer`,
                description : `
                    interleaveBuffer 정보
                `,
                example : `
                    // TODO:
                `,
                return : 'RedBuffer Instance'
            }
        :DOC*/
        var t0;
        t0 = makeData(redGL, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
        // TODO: 유일키 방어
        if (!redGL['_datas']['Primitives']) redGL['_datas']['Primitives'] = {};
        if (redGL['_datas']['Primitives'][t0['type']]) return redGL['_datas']['Primitives'][t0['type']]
        else redGL['_datas']['Primitives'][t0['type']] = this
        this['interleaveBuffer'] = t0['interleaveBuffer']
        /**DOC:
            {
                code : 'PROPERTY',
                title :`indexBuffer`,
                description : `
                    indexBuffer 정보
                `,
                example : `
                    // TODO:
                `,
                return : 'RedBuffer Instance'
            }
        :DOC*/
        this['indexBuffer'] = t0['indexBuffer']
        this['_UUID'] = RedGL['makeUUID']();
        // Object.freeze(this)
        console.log(this)
    }
    RedSphere.prototype = RedGeometry.prototype;
    Object.freeze(RedSphere);
})()