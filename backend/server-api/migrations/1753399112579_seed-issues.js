/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.sql(`
    INSERT INTO issues (
      title,
      description,
      contra_description,
      pro_description,
      contra_first_message,
      pro_first_message,
      image
    )
    VALUES 
    (
      'Apakah AI seharusnya menggantikan pekerjaan manusia?',
      'Kehadiran kecerdasan buatan (AI) dalam dunia kerja memicu banyak perdebatan. Di satu sisi, teknologi ini mampu menyelesaikan tugas dengan lebih cepat dan efisien, bahkan dalam lingkungan yang berisiko tinggi. Namun, di sisi lain, ada kekhawatiran bahwa AI akan menggantikan peran manusia, menyebabkan hilangnya pekerjaan, dan berdampak pada ekonomi serta stabilitas sosial. Dalam sesi ini, Anda akan mengeksplorasi argumen dari dua sisi tersebut.',
      'Sebagai pihak kontra, Anda meyakini bahwa penggunaan AI secara masif dalam pekerjaan akan berdampak negatif terhadap lapangan kerja manusia. Banyak pekerjaan yang sebelumnya dilakukan oleh manusia kini dapat diotomatisasi, yang berpotensi meningkatkan angka pengangguran. Anda juga khawatir bahwa AI tidak memiliki empati dan etika seperti manusia, sehingga berisiko dalam pekerjaan yang melibatkan keputusan moral.',
      'Sebagai pihak pro, Anda mendukung bahwa AI adalah kemajuan teknologi yang tidak bisa dihindari. Dengan AI, perusahaan dapat menghemat biaya, meningkatkan produktivitas, dan menyelesaikan pekerjaan yang terlalu berbahaya bagi manusia. Anda juga percaya bahwa AI membuka peluang pekerjaan baru dalam bidang teknologi dan pengembangan sistem.',
      'Penggunaan AI secara luas bisa berdampak negatif terhadap pekerja manusia dan tatanan sosial jika tidak diatur dengan baik.',
      'AI dapat menggantikan pekerjaan berbahaya dan meningkatkan efisiensi, membuka peluang baru dalam industri berbasis teknologi.',
      'https://example.com/images/ai-vs-human.jpg'
    ),
    (
      'Apakah sekolah online lebih baik daripada sekolah tatap muka?',
      'Pandemi global telah mempercepat peralihan ke sistem pembelajaran daring, memunculkan pertanyaan besar: apakah pembelajaran online bisa menggantikan sekolah tatap muka sepenuhnya? Isu ini menyoroti kelebihan dan kekurangan dari kedua metode pembelajaran, baik dari segi efektivitas pendidikan, interaksi sosial, maupun aksesibilitas teknologi. Anda akan berperan dalam menjelaskan dan mempertahankan salah satu sisi dari isu ini.',
      'Sebagai pihak kontra, Anda berpandangan bahwa sekolah tatap muka tetap yang terbaik. Interaksi langsung antara guru dan siswa membantu memahami materi dengan lebih baik, meningkatkan disiplin, dan membangun keterampilan sosial yang penting bagi perkembangan anak. Anda juga menyoroti kendala teknis dan gangguan konsentrasi yang sering terjadi dalam pembelajaran online.',
      'Sebagai pihak pro, Anda percaya bahwa sekolah online adalah masa depan pendidikan yang fleksibel. Siswa bisa belajar sesuai ritme mereka sendiri, dari mana saja, tanpa terbatas ruang dan waktu. Teknologi memungkinkan personalisasi pembelajaran dan akses ke berbagai sumber belajar digital yang kaya.',
      'Sekolah tatap muka memberikan pengalaman belajar yang lebih kaya secara sosial dan emosional dibandingkan daring.',
      'Pembelajaran daring memberikan fleksibilitas dan akses yang lebih luas, terutama di era digital saat ini.',
      'https://example.com/images/online-vs-offline.jpg'
    );
  `);
};

exports.down = (pgm) => {
    pgm.sql(`
    DELETE FROM issues WHERE title IN (
      'Apakah AI seharusnya menggantikan pekerjaan manusia?',
      'Apakah sekolah online lebih baik daripada sekolah tatap muka?'
    );
  `);
};
