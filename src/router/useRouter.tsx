type Query = Record<string, string | number>;
type Params = Record<string, number | string | Query>;

export const useRouter = (router: string, params?: Params): string => {
  const route: string[] = router.split("/").filter((val) => val != "");
  const generatedRoute = [...route];
  let query: Query = {};

  // Process the params to replace route placeholders and capture query parameters
  if (params)
    Object.keys(params).forEach((key) => {
      if (key !== "query") {
        const idx = route.indexOf(`:${key}`);
        if (idx !== -1) {
          generatedRoute[idx] = String(params[key]);
        }
      } else {
        query = params[key] as Query;
      }
    });

  // Build the base URL
  let returnUrl: string = "/" + generatedRoute.join("/");

  // Build the query string if query parameters exist
  if (query && Object.keys(query).length) {
    const querySTR = Object.keys(query).map((key) =>
      query[key] ? `${key}=${query[key]}` : ""
    );
    returnUrl += `?${querySTR.join("&")}`;
  }

  return returnUrl;
};
