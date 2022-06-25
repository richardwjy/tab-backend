const buildQuery = async (type, params) => {
  let query;

  let set = [];
  switch (type) {
    case "SELECT":
      //select butuh params.table dan params.filter untuk where
      query = [`SELECT * FROM ${params.table}`];
      query.push("WHERE");
      Object.keys(params.filter).forEach(function (key, i) {
        set.push(key + " = ($" + (i + 1) + ")");
      });
      if (Object.keys(params.filter).length > 1) {
        query.push(set.join(" AND "));
      } else {
        query.push(set.join(" "));
      }
      query = query.join(" ");
      break;
    case "UPDATE_BYID":
      //contoh filtering
      // if (!params.hasOwnProperty("filter")) {
      //   return { status: false };
      // }
      //UPDATE BY ID butuh params.table dan params.cols untuk jalan
      query = [`UPDATE ${params.table}`];
      query.push("SET");

      // Create another array storing each set command
      // and assigning a number value for parameterized query
      Object.keys(params.cols).forEach(function (key, i) {
        set.push(key + " = ($" + (i + 1) + ")");
      });
      query.push(set.join(", "));
      // Add the WHERE statement to look up by id
      query.push(`WHERE id = ` + params.cols.id);

      //Add the Returnin Statement
      query.push(`RETURNING *`);

      query = query.join(" ");
      break;

    default:
      break;
  }

  return { status: true, query };
};

module.exports = buildQuery;
