import axios from "axios"

export const allSearchServices = async () => {
  try {
    const allSearch = await axios.get("http://localhost:3001/api/search")
    return allSearch.data
  } catch (error) {
    throw error
  }
}

export const deleteSearchServices = async id => {
  try {
    const deleteSearch = await axios.delete(
      `http://localhost:3001/api/search/${id}`
    )
    return deleteSearch.data
  } catch (error) {
    throw error
  }
}

export const addSearchServices = async ({
  description_search,
  country,
  area_search,
  position,
  vacancies,
  lapse_search,
}) => {
  console.log("ESTA ES LA DATA QUE LLEGA AL SERVICE", {
    description_search: description_search,
    country: country,
    area_search: area_search,
    position: position,
    vacancies: vacancies,
    lapse_search: lapse_search,
  })
  try {
    const addSearch = await axios.post("http://localhost:3001/api/search/add", {
      description_search: description_search,
      country: country,
      area_search: area_search,
      position: position,
      vacancies: vacancies,
      lapse_search: lapse_search,
    })
    return addSearch.data
  } catch (error) {
    throw error
  }
}

export const singleSearchServices = async id => {
  try {
    const allSearch = await axios.get(`http://localhost:3001/api/search/${id}`)
    return allSearch.data
  } catch (error) {
    throw error
  }
}

export const editSearchServices = async ({
  id,
  description_search,
  country,
  area_search,
  position,
  vacancies,
  lapse_search,
  recruiterId,
  state_search
}) => {
  try {
    const editSearch = await axios.put(
      `http://localhost:3001/api/search/${id}`,
      {
        description_search: description_search,
        country: country,
        area_search: area_search,
        position: position,
        vacancies: vacancies,
        lapse_search: lapse_search,
        recruiterId: recruiterId,
        state_search: state_search,
      }
    )
    return editSearch.data
  } catch (error) {
    throw error
  }
}

export const newSearchsServices = async () => {
  try {
    const pendingSearchs = await axios.get(
      "http://localhost:3001/api/search/state/new"
    )
    return pendingSearchs.data
  } catch (error) {
    throw error
  }
}

export const startedSearchsServices = async () => {
  try {
    const activeSearchs = await axios.get(
      "http://localhost:3001/api/search/state/started"
    )
    return activeSearchs.data
  } catch (error) {
    throw error
  }
}

export const presentedSearchsServices = async () => {
  try {
    const suspendedSearchs = await axios.get(
      "http://localhost:3001/api/search/state/presented"
    )
    return suspendedSearchs.data
  } catch (error) {
    throw error
  }
}

export const revisionSearchsServices = async () => {
  try {
    const suspendedSearchs = await axios.get(
      "http://localhost:3001/api/search/state/revision"
    )
    return suspendedSearchs.data
  } catch (error) {
    throw error
  }
}

export const closedSearchsServices = async () => {
  try {
    const suspendedSearchs = await axios.get(
      "http://localhost:3001/api/search/state/closed"
    )
    return suspendedSearchs.data
  } catch (error) {
    throw error
  }
}

export const filteredByDateSearchsServices = async ({
  filter_start,
  filter_end,
}) => {
  try {
    const filteredByDate = await axios.post(
      "http://localhost:3001/api/search/filter_date",
      {
        filter_start: filter_start,
        filter_end: filter_end,
      }
    )
    return filteredByDate.data
  } catch (error) {
    throw error
  }
}

export const assignmentSearchsServices = async ({
  country,
  area_search,
}) => {
  try {
    const assignment = await axios.post("http://localhost:3001/api/search/assignment",
      {
        country: country,
        area_search: area_search,
      }
    )
    return assignment.data
  } catch (error) {
    throw error
  }
}
