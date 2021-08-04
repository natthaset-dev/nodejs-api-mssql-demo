const bodyParser = require('body-parser')
const db = require('mssql')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const config = {
    user: 'sa',
    password: 'so6,ko123',
    server: '192.168.1.205',
    database: 'DB_UAT',
    options: {
        trustServerCertificate: true,
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        }
    }
}

// home page
app.get('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to RESTful APIs by NodeJS.'
    })
})

// get all employees
app.get('/api/v1/employees', async (req, res) => {
    let sql = 'SELECT EMP_ID AS empId, FIRST_NAME AS firstName, LAST_NAME AS lastName, SECTION AS section FROM [EMPLOYEES]'
    await db.connect(config)
    let results = await db.query(sql)
    if (results === undefined || results.recordset.length == 0) {
        res.send({
            error: true,
            message: 'Data is not found.'
        })
    } else {
        res.send({
            error: false,
            message: 'Successfully.',
            data: results.recordset
        })
    }
})

// get employee by id
app.get('/api/v1/employee', async (req, res) => {
    let empId = req.body.empId
    if (!empId) {
        res.send({
            error: true,
            message: 'Please provide employee id.'
        })
    } else {
        let sql = `SELECT EMP_ID AS empId, FIRST_NAME AS firstName, LAST_NAME AS lastName, SECTION AS section FROM [EMPLOYEES] WHERE EMP_ID = '${empId}'`
        await db.connect(config)
        let results = await db.query(sql)
        if (results === undefined || results.recordset.length == 0) {
            res.send({
                error: true,
                message: 'Data is not found.'
            })
        } else {
            res.send({
                error: false,
                message: 'Successfully.',
                data: results.recordset[0]
            })
        }
    }
})

// add new employee
app.post('/api/v1/employee', async (req, res) => {
    let empId = req.body.empId
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let section = req.body.section

    if (!empId || !firstName || !lastName || !section) {
        res.send({
            error: true,
            message: 'Please provide employee data.'
        })
    } else {
        try {
            let sql = `INSERT INTO [EMPLOYEES] (EMP_ID, FIRST_NAME, LAST_NAME, SECTION) VALUES ('${empId}', '${firstName}', '${lastName}', '${section}')`
            await db.connect(config)
            let results = await db.query(sql)

            res.send({
                error: false,
                message: 'Successfully employee added.',
                data: results
            })
        } catch (ex) {
            res.send({
                error: true,
                message: ex.message
            })
        }
    }
})

// update employee by id
app.put('/api/v1/employee', async (req, res) => {
    let empId = req.body.empId
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let section = req.body.section

    if (!empId || !firstName || !lastName || !section) {
        res.send({
            error: true,
            message: 'Please provide employee data.'
        })
    } else {
        try {
            let sql = `UPDATE [EMPLOYEES] SET FIRST_NAME = '${firstName}', LAST_NAME = '${lastName}', SECTION = '${section}' WHERE EMP_ID = '${empId}'`
            await db.connect(config)
            let results = await db.query(sql)

            res.send({
                error: false,
                message: 'Successfully employee added.',
                data: results
            })
        } catch (ex) {
            res.send({
                error: true,
                message: ex.message
            })
        }
    }
})

// delete employee by id
app.delete('/api/v1/employee', async (req, res) => {
    let empId = req.body.empId

    if (!empId) {
        res.send({
            error: true,
            message: 'Please provide employee id.'
        })
    } else {
        try {
            let sql = `DELETE FROM [EMPLOYEES] WHERE EMP_ID = '${empId}'`
            await db.connect(config)
            let results = await db.query(sql)

            res.send({
                error: false,
                message: 'Successfully employee deleted.',
                data: results
            })
        } catch (ex) {
            res.send({
                error: true,
                message: ex.message
            })
        }
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})

module.exports = app