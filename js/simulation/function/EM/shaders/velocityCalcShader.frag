precision highp float;

uniform vec2 u_textureDim;
uniform float u_dt;

uniform sampler2D u_translation;
uniform sampler2D u_lastTranslation;
uniform sampler2D u_mass;

void main(){
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 scaledFragCoord = fragCoord/u_textureDim;

    float isFixed = texture2D(u_mass, scaledFragCoord).y;
    if (isFixed < 0.0 || isFixed == 1.0){//no cell or is fixed
        gl_FragColor = vec4(0, 0, 0, 0);
        return;
    }

    vec4 _lastPosition = texture2D(u_lastTranslation, scaledFragCoord);
    vec4 _position = texture2D(u_translation, scaledFragCoord);

    vec3 lastTranslation = _lastPosition.xyz;
    vec3 translation = _position.xyz;

    float lastRotation = _lastPosition[3];
    float rotation = _position[3];

    vec3 velocity = (translation - lastTranslation)/u_dt;
    float angVelocity = (rotation - lastRotation)/u_dt;

    gl_FragColor = vec4(velocity, angVelocity);
}