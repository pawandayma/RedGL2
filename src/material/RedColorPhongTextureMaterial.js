"use strict";
var RedColorPhongTextureMaterial;
(function () {
	var vSource, fSource;
	var PROGRAM_NAME = 'colorPhongTextureProgram';
	vSource = function () {
		/* @preserve
		 uniform vec4 u_color;
		 varying vec4 vColor;
		 uniform sampler2D u_displacementTexture;
		 uniform float u_displacementPower;
	     uniform float u_displacementFlowSpeedX;
		 uniform float u_displacementFlowSpeedY;
		 varying vec4 vVertexPositionEye4;
		 void main(void) {
			 vColor = u_color;
			 vTexcoord = uAtlascoord.xy + aTexcoord * uAtlascoord.zw;
			 vVertexNormal = vec3(uNMatrix * vec4(aVertexNormal,1.0));
			 vVertexPositionEye4 = uMMatrix * vec4(aVertexPosition, 1.0);
		     vVertexPositionEye4.xyz += normalize(vVertexNormal) * texture2D(u_displacementTexture, vTexcoord + vec2(
			    u_displacementFlowSpeedX * (uTime/1000.0),
			    u_displacementFlowSpeedY * (uTime/1000.0)
		     )).x * u_displacementPower ;
			 gl_PointSize = uPointSize;
			 gl_Position = uPMatrix * uCameraMatrix* vVertexPositionEye4;
		 }
		 */
	}
	fSource = function () {
		/* @preserve
		 precision mediump float;
		 uniform sampler2D u_normalTexture;
		 uniform sampler2D u_specularTexture;

		 uniform float u_shininess;
		 uniform float u_specularPower;

		 varying vec4 vVertexPositionEye4;
		 varying vec4 vColor;

		 float fogFactor(float perspectiveFar, float density){
			 float flog_cord = gl_FragCoord.z / gl_FragCoord.w / perspectiveFar;
			 float fog = flog_cord * density;
			 if(1.0 - fog < 0.0) discard;
			return clamp(1.0 - fog, 0.0,  1.0);
		 }
		 vec4 fog(float fogFactor, vec4 fogColor, vec4 currentColor) {
			return mix(fogColor, currentColor, fogFactor);
		 }
		 void main(void) {
			 vec4 la = uAmbientLightColor * uAmbientLightColor.a;
			 vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
			 vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);

			 vec4 texelColor = vColor;
			 // texelColor.rgb *= texelColor.a;

			 vec3 N = normalize(vVertexNormal);
			 vec4 normalColor = texture2D(u_normalTexture, vTexcoord);
			 if(normalColor.a != 0.0) N = normalize(2.0 * (N + normalColor.rgb  - 0.5));

			 vec4 specularLightColor = vec4(1.0, 1.0, 1.0, 1.0);
			 float specularTextureValue = 1.0;
			 specularTextureValue = texture2D(u_specularTexture, vTexcoord).r;
			 float specular;

			 vec3 L;
			 vec3 R;
			 highp float lambertTerm;
			 for(int i=0; i<cDIRETIONAL_MAX; i++){
				 if(i == uDirectionalLightNum) break;
				 L = normalize(-uDirectionalLightPosition[i]);
				 lambertTerm = dot(N,-L);
				 if(lambertTerm > 0.0){
					 ld += (uDirectionalLightColor[i] * texelColor * lambertTerm * uDirectionalLightIntensity[i]) * uDirectionalLightColor[i].a;
					 R = reflect(L, N);
					 specular = pow( max(dot(R, -L), 0.0), u_shininess);
					 ls +=  specularLightColor * specular * u_specularPower * specularTextureValue * uDirectionalLightIntensity[i];
				 }
			 }
			 vec3 pointDirection;
			 highp float distanceLength;
			 highp float attenuation;
			 for(int i=0;i<cPOINT_MAX;i++){
			 if(i== uPointLightNum) break;
				 pointDirection =  -uPointLightPosition[i] + vVertexPositionEye4.xyz;
				 distanceLength = length(pointDirection);
				 if(uPointLightRadius[i]> distanceLength){
					 attenuation = 1.0 / (0.01 + 0.02 * distanceLength + 0.03 * distanceLength * distanceLength);
					 L = normalize(pointDirection);
					 lambertTerm = dot(N,-L);
					 if(lambertTerm > 0.0){
						 ld += (uPointLightColor[i] * texelColor * lambertTerm * attenuation * uPointLightIntensity[i]) * uPointLightColor[i].a;
						 R = reflect(L, N);
						 specular = pow( max(dot(R, -L), 0.0), u_shininess);
						 ls +=  specularLightColor * specular * u_specularPower * specularTextureValue * uPointLightIntensity[i] ;
					 }
				 }
			 }

			 vec4 finalColor = la * uAmbientIntensity + ld + ls;
			 finalColor.rgb *= texelColor.a;
			 finalColor.a = texelColor.a;
			 if(uUseFog) gl_FragColor = fog( fogFactor(uFogDistance, uFogDensity), uFogColor, finalColor);
			 else gl_FragColor = finalColor;
		 }
		 */
	}
	/**DOC:
	 {
		 constructorYn : true,
		 title :`RedColorPhongTextureMaterial`,
		 description : `
			 RedColorPhongTextureMaterial Instance 생성
		 `,
		 params : {
			 redGL : [
				 {type:'RedGL'}
			 ],
			 hexColor : [
				 {type:'hex'}
			 ],
			 alpha : [
				 {type:'number'},
				 '알파값'
			 ],
			 normalTexture : [
				 {type: 'RedBitmapTexture'}
			 ],
			 specularTexture : [
				 {type: 'RedBitmapTexture'}
			 ],
			 specularTexture : [
				 {type: 'RedBitmapTexture'}
			 ],
			 displacementTexture : [
				 {type: 'RedBitmapTexture'}
			 ]
		 },
		 example: `
		 RedColorPhongTextureMaterial(RedGL Instance, hex, alpha, normalTexture, specularTexture)
		 `,
		 return : 'RedColorPhongTextureMaterial Instance'
	 }
	 :DOC*/
	RedColorPhongTextureMaterial = function (redGL, hexColor, alpha, normalTexture, specularTexture, displacementTexture) {
		if ( !(this instanceof RedColorPhongTextureMaterial) ) return new RedColorPhongTextureMaterial(redGL, hexColor, alpha, normalTexture, specularTexture, displacementTexture);
		if ( !(redGL instanceof RedGL) ) RedGLUtil.throwFunc('RedColorPhongTextureMaterial : RedGL Instance만 허용됩니다.', '입력값 : ' + redGL);
		/////////////////////////////////////////
		// 유니폼 프로퍼티
		this['_color'] = new Float32Array(4);
		/**DOC:
		 {
			 title :`normalTexture`,
			 return : 'RedBitmapTexture'
		 }
		 :DOC*/
		this['normalTexture'] = normalTexture;
		/**DOC:
		 {
			 title :`specularTexture`,
			 return : 'RedBitmapTexture'
		 }
		 :DOC*/
		this['specularTexture'] = specularTexture;
		/**DOC:
		 {
			 title :`displacementTexture`,
			 return : 'RedBitmapTexture'
		 }
		 :DOC*/
		this['displacementTexture'] = displacementTexture;
		/**DOC:
		 {
			 title :`shininess`,
			 description : `기본값 : 16`,
			 return : 'Number'
		 }
		 :DOC*/
		this['shininess'] = 16
		/**DOC:
		 {
			 title :`specularPower`,
			 description : `기본값 : 1`,
			 return : 'Number'
		 }
		 :DOC*/
		this['specularPower'] = 1
		/**DOC:
		 {
			 title :`displacementPower`,
			 description : `기본값 : 0`,
			 return : 'Number'
		 }
		 :DOC*/
		this['displacementPower'] = 0

		this['displacementFlowSpeedX'] = 0
		this['displacementFlowSpeedY'] = 0
		/////////////////////////////////////////
		// 일반 프로퍼티
		Object.defineProperty(this, 'color', RedDefinePropertyInfo['color']);
		Object.defineProperty(this, 'alpha', RedDefinePropertyInfo['alpha']);
		this['alpha'] = alpha == undefined ? 1 : alpha;
		this['color'] = hexColor ? hexColor : '#ff0000'
		this['normalTexture'] = normalTexture;
		this['specularTexture'] = specularTexture;
		this['displacementTexture'] = displacementTexture;
		this['program'] = RedProgram['makeProgram'](redGL, PROGRAM_NAME, vSource, fSource);
		this['_UUID'] = RedGL['makeUUID']();
		this.checkUniformAndProperty();
		;
		console.log(this);
	}
	RedColorPhongTextureMaterial.prototype = new RedBaseMaterial()
	RedDefinePropertyInfo.definePrototype('RedColorPhongTextureMaterial', 'normalTexture', 'sampler2D');
	RedDefinePropertyInfo.definePrototype('RedColorPhongTextureMaterial', 'specularTexture', 'sampler2D');
	RedDefinePropertyInfo.definePrototype('RedColorPhongTextureMaterial', 'displacementTexture', 'sampler2D');
	RedDefinePropertyInfo.definePrototype('RedColorPhongTextureMaterial', 'shininess', 'number', {'min': 0});
	RedDefinePropertyInfo.definePrototype('RedColorPhongTextureMaterial', 'specularPower', 'number', {'min': 0});
	RedDefinePropertyInfo.definePrototype('RedColorPhongTextureMaterial', 'displacementPower', 'number', {'min': 0});
	RedDefinePropertyInfo.definePrototype('RedColorPhongTextureMaterial', 'displacementFlowSpeedX', 'number');
	RedDefinePropertyInfo.definePrototype('RedColorPhongTextureMaterial', 'displacementFlowSpeedY', 'number');
	Object.freeze(RedColorPhongTextureMaterial)
})();