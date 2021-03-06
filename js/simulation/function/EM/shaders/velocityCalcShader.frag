precision highp float;

uniform vec2 u_textureDim;
uniform float u_dt;

uniform sampler2D u_acceleration;
uniform sampler2D u_lastVelocity;
uniform sampler2D u_mass;

void main(){
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 scaledFragCoord = fragCoord/u_textureDim;

    float isFixed = texture2D(u_mass, scaledFragCoord).y;
    if (isFixed < 0.0 || isFixed == 1.0){//no cell or is fixed
        gl_FragColor = vec4(0, 0, 0, 0);
        return;
    }

    vec4 _lastVelocity = texture2D(u_lastVelocity, scaledFragCoord);
    vec4 _acceleration = texture2D(u_acceleration, scaledFragCoord);

    vec3 lastVelocity = _lastVelocity.xyz;
    vec3 acceleration = _acceleration.xyz;

    float lastAngVelocity = _lastVelocity[3];
    float angAccleration = _acceleration[3];

    vec3 velocity = acceleration*u_dt + lastVelocity;
    float angVelocity = angAccleration*u_dt + lastAngVelocity;

    gl_FragColor = vec4(velocity, angVelocity);
}