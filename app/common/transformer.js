module.exports = class Transformer {
  static metaData(count, currentPage, perPage) {
    return {
      itemCount: count,
      pageCount: Math.round(count / perPage) || 0,
      page: currentPage,
      perPage,
      next: currentPage + 1,
    };
  }

  static transform({ count, currentPage, data }) {
    return {
      data,
      meta_data: this.metaData(count, parseInt(currentPage, 10), data.length),
    };
  }
};
