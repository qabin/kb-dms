export const Optional = function (value) {
  this.value = value;

  this.ofNullable = function (value) {
    return new Optional(value)
  };

  this.map = function (func) {
    if (this.value) {
      this.value = func(this.value)
    }
    return this;
  };

  this.orElse = function (funcOrValue) {
    if (this.value)
      return this.value;
    else
      return typeof funcOrValue === 'function' ? funcOrValue() : funcOrValue;
  };

  this.ifPresent = function (consumer) {
    if (this.value) {
      consumer(this.value)
    }
  }
};

Optional.ofNullable = function (value) {
  return new Optional(value)
};


