const { Searchs, Recruiters } = require("../models/")
const { Op, Sequelize } = require("sequelize")

exports.add = (req, res) => {
  const {
    country,
    area_search,
    position,
    description_search,
    vacancies,
    lapse_search,
    recruiterId,
  } = req.body
  try {
    Searchs.create({
      country,
      area_search,
      position,
      description_search,
      vacancies,
      lapse_search,
      recruiterId,
    }).then(data => res.status(201).send(data))
  } catch (error) {
    console.log("ERROR: ", error)
  }
}

exports.delete = (req, res) => {
  const { id } = req.params
  try {
    Searchs.destroy({ where: { id } }).then(() => res.sendStatus(202))
  } catch (error) {
    console.log("ERROR: ", error)
  }
}

exports.getId = (req, res) => {
  const { id } = req.params
  try {
    Searchs.findOne({ where: { id } }).then(data => res.status(200).send(data))
  } catch (error) {
    console.log("ERROR: ", error)
  }
}

exports.getList = (req, res) => {
  const { page, state, country } = req.body
  const initialLimit = 20
  const cut = page >= 2 ? initialLimit * page - initialLimit : 0
  const getPagingData = (search, page, limit) => {
    const { count: totalItems, rows: filas } = search
    const currentPage = page ? +page : 0
    const totalPages = Math.ceil(totalItems / limit)
    return { totalItems, filas, totalPages, currentPage }
  }
  const checkWhere = (state, country) => {
    if (state !== "Todas" && country !== "Todos") return { state_search: state, country: country }
    if (state !== "Todas") return { state_search: state }
    if (country !== "Todos") return { country: country }
  }
  try {
    Searchs.findAndCountAll({
      include: Recruiters,
      where: checkWhere(state, country),
      order: [["id", "DESC"]],
      limit: initialLimit,
      offset: cut,
    }).then(newSearchs => {
      const response = getPagingData(newSearchs, page, initialLimit)
      res.status(200).send(response)
    }
    )
  } catch (error) {
    console.log("ERROR: ", error)
  }
}

exports.editSearch = (req, res) => {
  const { id } = req.params
  const {
    description_search,
    country,
    area_search,
    position,
    vacancies,
    lapse_search,
    recruiterId,
    start_date,
  } = req.body
  try {
    if (recruiterId) {
      let recruiterOld
      Searchs.findByPk(id).then(data => {
        console.log("este es el recruiterOld", recruiterOld)
        recruiterOld = data.dataValues.recruiterId

        if (recruiterId != recruiterOld && recruiterOld != null) {
          // actualizacion del reclutador por otro
          console.log("entro al if", recruiterId)

          Recruiters.update(
            { active_searchs: Sequelize.literal('active_searchs - 1') },
            {
              where: { id: recruiterOld },
            }
          )
          Searchs.update(
            {
              description_search,
              country,
              area_search,
              position,
              vacancies,
              lapse_search,
              recruiterId,
              start_date,
              state_search: "Iniciada",
            },
            {
              where: { id },
              returning: true,
              plain: true,
            }
          )
          Recruiters.update(
            { active_searchs: Sequelize.literal('active_searchs + 1') },
            {
              where: { id: recruiterId },
            }
          )

          res.sendStatus(200)
        } else {
          // se vincula por primera vez un reclutador a esa busqueda
          console.log("entro al else")
          Searchs.update(
            {
              description_search,
              country,
              area_search,
              position,
              vacancies,
              lapse_search,
              recruiterId,
              start_date,
              state_search: "Iniciada",
            },
            {
              where: { id },
              returning: true,
              plain: true,
            }
          )
          Recruiters.update(
            { active_searchs: Sequelize.literal('active_searchs + 1') },
            {
              where: { id: recruiterId },
            }
          ).then(data => res.status(201).send(data))
        }
      })
      console.log("este es el reclutador anterior:", recruiterOld)
      console.log("este es ele reclutador nuevo", recruiterId)
    } else {
      // actualización de datos sin el reclutador id
      console.log("no hay recruiter id")
      Searchs.update(req.body, {
        where: { id },
        returning: true,
        plain: true,
        description_search,
        country,
        area_search,
        position,
        vacancies,
        lapse_search,
      }).then(data => res.status(201).send(data))
    }
  } catch (error) {
    console.log("ERROR: ", error)
  }
}

exports.filterDate = (req, res) => {
  const { filter_start, filter_end } = req.body
  console.log("filter_start PARA FILTRO FECHA--------------->", filter_start)
  try {
    Searchs.findAll({
      where: {
        [Op.and]: [
          {
            start_date: { [Op.between]: [filter_start, filter_end] },
            end_date: { [Op.between]: [filter_start, filter_end] },
          },
        ],
      },
    }).then(data => res.status(200).send(data))
  } catch (error) {
    console.log("ERROR: ", error)
  }
}

exports.assignment = (req, res) => {
  const { country, area_search } = req.body
  console.log("--->", req.body)
  try {
    Recruiters.findAll({
      where: {
        [Op.and]: [
          {
            country: { [Op.eq]: [country] },
            area_rec: { [Op.substring]: [area_search] },
            active_searchs: { [Op.lt]: [3] },
          },
        ],
      },
      include: Searchs,
      order: [["rating", "DESC"]],
    }).then(data => res.status(200).send(data))
  } catch (error) {
    console.log("ERROR: ", error)
  }
}

exports.endSearch = async (req, res) => {
  const { id, end_date, rating, recruiterId } = req.body
  console.log(req.body)
  try {
    const editSearch = await Searchs.update(
      {
        end_date: end_date,
        recruiterId: null,
        state_search: "Cerrada",
      },
      {
        where: { id: id },
      }
    )
    //res.status(200).send(editSearch)

    const editRecruiter = await Recruiters.update(
      {
        rating: rating,
        active_searchs: Sequelize.literal('active_searchs - 1'),
      },
      {
        where: { id: recruiterId },
      }
    )
    res.status(200).send(editRecruiter)
  } catch (error) {
    console.log("ERROR: ", error)
  }
}

exports.unassign = async (req, res) => {
  const { id } = req.params
  try {
    Searchs.findByPk(id).then(data => {
      let idRecruiter = data.dataValues.recruiterId

      Searchs.update(
        {
          recruiterId: null,
          state_search: "Nueva",
        },
        {
          where: { id },
          returning: true,
          plain: true,
        }
      )
      Recruiters.update(
        { active_searchs: Sequelize.literal('active_searchs - 1') },
        {
          where: { id: idRecruiter },
        }
      ).then(data => res.status(201).send(data))
    })
  } catch (error) {
    console.log("ERROR: ", error)
  }
}