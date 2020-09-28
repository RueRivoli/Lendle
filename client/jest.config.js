module.exports = {
    verbose: true,
    roots: ["<rootDir>/src/components", "<rootDir>/specs/"],
    moduleFileExtensions: ['js', 'vue'],
    moduleNameMapper: {
        '^@/store/(.*)$': '<rootDir>/src/store/$1',
        '^@/(.*)$': '<rootDir>/src/components/$1',
    },
    transform: {
        "^.+\\.js$": 'babel-jest',
        "^.+\\.vue$": "vue-jest"
    },
    snapshotSerializers: [
        "<rootDir>/node_modules/jest-serializer-vue"
    ]
}