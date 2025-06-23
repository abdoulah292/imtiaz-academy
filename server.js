const 
    express = require('express'),
    app = express(),
    mysql = require('mysql2'),
    db = require('./databaseConnection'), // استدعاء الاتصال بقاعدة البيانات
    port = 4000,
    cors = require('cors'),
    bodyParser = require('body-parser');
    path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  }); 


// API جديد للحصول على المدرسين حسب معرف المادة
app.get('/api/teachers/subject/:subjectId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                t.id,
                t.name,
                t.qualifications,
                t.description,
                t.email,
                t.phone,
                t.avatar,
                t.stage_id,
                s.name AS stage_name,
                sub.id AS subject_id,
                sub.name AS subject_name,
                sub.img AS subject_img
            FROM teacher t
            LEFT JOIN stage s ON t.stage_id = s.id
            LEFT JOIN subject sub ON t.subject_id = sub.id
            WHERE t.subject_id = ?;
        `, [req.params.subjectId]);

        // إعادة ترتيب البيانات لتكون كل المراحل داخل مصفوفة لكل مدرس
        const teachersMap = {};
        rows.forEach(row => {
            if (!teachersMap[row.id]) {
                teachersMap[row.id] = {
                    id: row.id,
                    name: row.name,
                    qualifications: row.qualifications,
                    description: row.description,
                    email: row.email,
                    phone: row.phone,
                    avatar: row.avatar,
                    subject: {
                        id: row.subject_id,
                        name: row.subject_name,
                        img: row.subject_img,
                    },
                    stage: {
                        id: row.stage_id,
                        name: row.stage_name,
                    },
                };
            }
        });
        console.log(Object.values(teachersMap))
        console.log(teachersMap)
        return res.json(Object.values(teachersMap));
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/teachers/:id?', async (req, res) => {
  try {
    if (req.params.id) {
        console.log(req.params.id)
      const [rows] = await db.query(`
            SELECT 
                t.id,
                t.name,
                t.qualifications,
                t.description,
                t.email,
                t.phone,
                t.subject_id,
                t.avatar,
                t.stage_id,
                s.name AS stage_name,
                sub.id AS subject_id,
                sub.name AS subject_name,
                sub.img AS subject_img
            FROM teacher t
            LEFT JOIN stage s ON t.stage_id = s.id
            LEFT JOIN subject sub ON t.subject_id = sub.id
            WHERE t.id = ?;
      `, [req.params.id]);

      // ✅ إذا لم يتم العثور على المدرس
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Teacher not found" });
      }

      // ✅ تجهيز بيانات المدرس
      const teacher = {
        id: rows[0].id,
        name: rows[0].name,
        qualifications: rows[0].qualifications,
        description: rows[0].description,
        email: rows[0].email,
        phone: rows[0].phone,
        avatar: rows[0].avatar,
        subject: {
          id: rows[0].subject_id,
          name: rows[0].subject_name,
          img: rows[0].subject_img
        },
        stage: {
          id: rows[0].stage_id,
          name: rows[0].stage_name
        }
      };
      console.log(teacher)
      // ✅ إضافة المراحل التي يدرسها المدرس
      rows.forEach(row => {
        if (row.stage) {
          teacher.stage_id.push({
            id: row.stage_id,
            name: row.stage_name,
          });
        }
      });

      console.log(teacher)
      return res.json({success : true ,data : teacher});
    } 
    
    // ✅ جلب جميع المدرسين مع معلومات المادة والمرحلة
    const [rows] = await db.query(`
        SELECT 
            t.id,
            t.name,
            t.qualifications,
            t.description,
            t.email,
            t.phone,
            t.subject_id,
            t.avatar,
            t.stage_id,
            s.name AS stage_name,
            sub.name AS subject_name,
            sub.img AS subject_img
        FROM teacher t
        LEFT JOIN stage s ON t.stage_id = s.id
        LEFT JOIN subject sub ON t.subject_id = sub.id
    `);

    // ✅ إعادة ترتيب البيانات لتكون كل المدرس مع معلومات المرحلة
    const teachersMap = {};
    rows.forEach(row => {
        if (!teachersMap[row.id]) {
            teachersMap[row.id] = {
                id: row.id,
                name: row.name,
                qualifications: row.qualifications,
                description: row.description,
                email: row.email,
                phone: row.phone,
                avatar: row.avatar,
                subject: {
                    id: row.subject_id,
                    name: row.subject_name,
                    img: row.subject_img
                },
                stage: {
                    id: row.stage_id,
                    name: row.stage_name
                }
            };
        }
    });

    return res.json(Object.values(teachersMap));

  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.use(express.static('build'));

app.get('*' , (req , res) => {
    res.sendFile(path.join(__dirname , 'build' , 'index.html'))
})