/*
 * 题库文件 —— 你只需要改这个文件
 * ------------------------------------------------------------
 * 支持三种题型：
 *
 * 1) 单选（answer 写一个选项字母）
 *    { type: "single", stem: "题干", options: ["A选项","B选项","C选项","D选项"], answer: "B", analysis: "解析（可省略）" }
 *
 * 2) 多选（answer 写多个字母，逗号、空格、顿号都行；顺序无所谓）
 *    { type: "multiple", stem: "题干", options: [...], answer: "A,C,D", analysis: "..." }
 *
 * 3) 判断（answer 写 true/false，或者 对/错、√/×、T/F）
 *    { type: "judge", stem: "题干", answer: true, analysis: "..." }
 *
 * 说明：
 * - 选项字母 A/B/C/D... 由系统自动生成，不用自己写。
 * - 没写 type 的题，按 answer 自动猜：true/false → 判断，含多个字母 → 多选，否则单选。
 * - 题组用 { group: "题组名", questions: [...] } 包起来，做题时按组呈现。
 */
window.QUIZ_BANK = [
  {
    group: "一、单选题（50 分）",
    questions: [
      {
        type: "single",
        stem: "目前大部分国产操作系统开发的基础是？",
        options: ["Android 内核", "macOS 内核", "Linux 内核", "Windows 内核"],
        answer: "C",
        analysis: "国产操作系统（麒麟、统信 UOS 等）绝大多数基于 Linux 内核开发。"
      },
      {
        type: "single",
        stem: "安装操作系统前需要进行很多前期准备工作，以下哪项不属于安装前的准备工作？",
        options: ["检查硬件兼容性", "备份数据", "系统登录", "硬盘分区划分"],
        answer: "C",
        analysis: "系统登录是安装完成后的操作，不属于安装前的准备工作。"
      },
      {
        type: "single",
        stem: "在兼容性检查中，最主要的是检测哪一方面的兼容性？",
        options: ["硬件兼容性", "软件兼容性", "操作系统兼容性", "软件共享"],
        answer: "A",
        analysis: "安装操作系统首先要确认 CPU、内存、硬盘、网卡等硬件是否在支持列表内，硬件兼容性是首要的。"
      },
      {
        type: "single",
        stem: "关于数据备份，以下描述正确的是？",
        options: [
          "新硬盘也需要进行数据备份",
          "多个操作系统共存时需要备份数据",
          "在已使用过的硬盘上安装新操作系统时无需备份数据",
          "格式化后，硬盘中数据仍可以直接访问，所以无需备份"
        ],
        answer: "B",
        analysis: "新硬盘无数据可备份；已用过的硬盘安装新系统恰恰最需要备份；格式化会清空数据，无法再访问。多系统共存时安装新系统可能影响引导和已有分区，必须备份。"
      },
      {
        type: "single",
        stem: "若存在硬盘 /dev/sda，则以下哪种分区情况不可能出现？",
        options: ["sda1,sda2,sda5", "sda1,sda2,sda3,sda4", "sda1,sda2,sda3,sda5", "sda5,sda6,sda7"],
        answer: "D",
        analysis: "逻辑分区必须建在扩展分区内，而扩展分区的编号只能是 1~4。D 中只有 5、6、7 三个逻辑分区，缺少承载它们的扩展分区，因此不可能出现。"
      },
      {
        type: "single",
        stem: "以下关于分区描述错误的是？",
        options: [
          "swap 分区推荐大小为内存的 2 倍",
          "若希望使用系统的备份恢复功能，则需要创建 /backup 分区",
          "/boot 分区无需过大，一般设置为 50M 左右即可",
          "根分区 / 大小必须不小于 10G"
        ],
        answer: "C",
        analysis: "/boot 存放内核和 initramfs，50M 远远不够，实际一般建议 1~2G 以上。"
      },
      {
        type: "single",
        stem: "麒麟操作系统命令行界面中，以下哪个标识是普通用户命令提示符？",
        options: ["#", "%", "&", "$"],
        answer: "D",
        analysis: "普通用户提示符为 $，超级用户 root 为 #。"
      },
      {
        type: "single",
        stem: "麒麟操作系统默认使用的 shell 是？",
        options: ["Bourne-again shell", "Bourne shell", "Z shell", "C shell"],
        answer: "A",
        analysis: "Bourne-again shell 即 bash，是麒麟（及绝大多数 Linux）的默认 shell。"
      },
      {
        type: "single",
        stem: "在麒麟操作系统的默认 shell 中，如何搜索命令历史记录？",
        options: ["Ctrl+e", "Ctrl+f", "Ctrl+r", "Ctrl+s"],
        answer: "C",
        analysis: "Ctrl+r 进入反向增量搜索历史命令；Ctrl+e 移到行尾；Ctrl+f 前移一个字符；Ctrl+s 在部分终端中会锁屏。"
      },
      {
        type: "single",
        stem: "想要查看目录下所有内容（包括隐藏），则需要使用 ls 命令的哪个参数？",
        options: ["ls -l", "ls -a", "ls -all", "ls -s"],
        answer: "B",
        analysis: "-a 显示全部文件含以 . 开头的隐藏文件；-l 长格式；-s 显示块大小。"
      },
      {
        type: "single",
        stem: "以下说法错误的是？",
        options: [
          "在麒麟操作系统中，root 为超级用户",
          "root 用户的 UID 为 0",
          "在系统中新建一普通用户 user01，其 UID 为 900",
          "用户 ID（UID）是用户账户的唯一标识"
        ],
        answer: "C",
        analysis: "普通用户 UID 通常从 1000 起分配（部分发行版为 500），900 属于系统用户（服务账户）范围。"
      },
      {
        type: "single",
        stem: "关于组的概念，以下说法错误的是？",
        options: [
          "组中的成员用户拥有组权限",
          "组 ID（GID）是组账户的唯一标识",
          "一个组可以包含多个用户",
          "一个用户只能属于一个组"
        ],
        answer: "D",
        analysis: "一个用户有一个主组，还可以加入多个附加组，并非只能属于一个组。"
      },
      {
        type: "single",
        stem: "关于文件系统下列说法错误的是？",
        options: [
          "Linux 常用的文件系统有 ext3、ext4、XFS 等",
          "麒麟操作系统默认的文件系统为 ext3",
          "对分区进行格式化均会清空分区内容",
          "文件系统是操作系统用于明确磁盘或分区上的文件的方法和数据结构"
        ],
        answer: "B",
        analysis: "银河麒麟操作系统默认使用 ext4（部分版本/场景为 XFS），不是 ext3。"
      },
      {
        type: "single",
        stem: "若创建用户时不指定组信息，则以下说法正确的是？",
        options: ["若有同名组会直接加入", "允许用户没有组", "加入运行创建用户指令的用户所属组", "会尝试创建并加入同名组"],
        answer: "D",
        analysis: "useradd 不指定 -g 时，默认创建与用户名同名的组并把用户放进去。"
      },
      {
        type: "single",
        stem: "以下对目录描述错误的是？",
        options: ["/dev 存放设备文件", "/home 为用户家目录", "/mnt 用于挂载其他临时文件系统", "/etc 存放配置文件"],
        answer: "B",
        analysis: "/home 是普通用户家目录的父目录，root 的家目录是 /root，并不在 /home 下，因此“/home 为用户家目录”的说法不准确。"
      },
      {
        type: "single",
        stem: "关于目录树说法正确的是？",
        options: [
          "目录树的起始点为根目录“/home”",
          "在目录树当中的文件名（包含完整路径）都是独一无二的",
          "绝对路径：从用户工作目录开始的路径",
          "相对路径：从“根”开始的路径，也称为完全路径"
        ],
        answer: "B",
        analysis: "目录树起点是根目录 /；绝对路径从 / 开始；相对路径从当前工作目录开始。完整路径唯一，故 B 正确。"
      },
      {
        type: "single",
        stem: "下列关于软硬链接描述错误的是？",
        options: ["软链接可以跨文件系统", "硬链接不占用实际空间", "可以给文件和目录创建硬链接", "可以给文件和目录创建软链接"],
        answer: "C",
        analysis: "硬链接只能针对文件创建，不能给目录建硬链接；软链接（符号链接）文件和目录都可以。"
      },
      {
        type: "single",
        stem: "以下哪个命令显示文件 /etc/passwd 末尾的 5 行。",
        options: ["tail -5 /etc/passwd", "tail -n /etc/passwd", "tail 5 /etc/passwd", "tail -five /etc/passwd"],
        answer: "A",
        analysis: "tail -5 等价于 tail -n 5，显示末尾 5 行。"
      },
      {
        type: "single",
        stem: "下列关于文件类型的描述中，错误的是？",
        options: ["d 表示目录", "- 表示普通文件", "l 表示长文件", "c 表示字符设备文件"],
        answer: "C",
        analysis: "l 表示符号链接（软链接），不是“长文件”。"
      },
      {
        type: "single",
        stem: "现有 user01，user02，同属于组 group1，若 user01 创建文件 file1，若 user01 进行如下操作：chmod 664 file1，则下列选项说法错误的是？",
        options: ["user01 可以读写 file1", "user02 可以读写 file1", "user02 可以读但不能写 file1", "user01 不可以执行 file1"],
        answer: "C",
        analysis: "664 = rw-rw-r--，属组有写权限，user02 与 user01 同组，因此 user02 可读可写，C 错误。"
      },
      {
        type: "single",
        stem: "关于查看隐藏权限的命令 lsattr，以下关于参数说明错误的是？",
        options: [
          "参数 -d 表示如果是目录，则列出目录的属性",
          "参数 -a 表示列出文件的所有权限",
          "参数 -R 表示递归显示目录内容",
          "参数 -v 表示显示文件或目录版本"
        ],
        answer: "B",
        analysis: "-a 是列出目录下的所有文件（含隐藏文件），不是“所有权限”。"
      },
      {
        type: "single",
        stem: "关于目录的特殊权限设置，下列说法错误的是？",
        options: [
          "SGID 可以对目录设置",
          "对目录设置 SGID 属性，可以使目录下创建的文件的所权继承原目录的所有者",
          "SBIT 可以对目录设置",
          "对目录设置 SBIT 权限，当使用者在该目录下创建文件或目录时，仅自己有权利删除该文件"
        ],
        answer: "B",
        analysis: "目录设置 SGID 后，其下新建文件继承的是目录的“属组”，不是“所有者”。"
      },
      {
        type: "single",
        stem: "在 vi 编辑器中，想搜索单词 kylin，应如何操作？",
        options: ["kylin", ":kylin", "/kylin", "s kylin"],
        answer: "C",
        analysis: "vi 命令模式下用 /关键字 向下搜索，?关键字 向上搜索。"
      },
      {
        type: "single",
        stem: "在银河麒麟桌面操作系统新创建网络链接时，若希望可以自动设置 IP 地址等信息，应该选择哪种方式？",
        options: ["手动设置", "DHCP", "仅本地连接", "与其他计算机共享"],
        answer: "B",
        analysis: "DHCP 由服务器自动下发 IP、掩码、网关、DNS。"
      },
      {
        type: "single",
        stem: "Nginx 是一个轻量级什么服务器？",
        options: ["数据库", "web", "域名解析", "时间"],
        answer: "B",
        analysis: "Nginx 是轻量级高性能 Web 服务器，也常作反向代理和负载均衡。"
      },
      {
        type: "single",
        stem: "nfs 的共享配置文件存放在哪个目录下？",
        options: ["/etc/", "/usr/", "/var/", "/sbin/"],
        answer: "A",
        analysis: "NFS 共享配置文件是 /etc/exports。"
      },
      {
        type: "single",
        stem: "在银河麒麟服务器操作系统中使用哪个命令查看时区？",
        options: ["time", "date", "timedatectl", "timectl"],
        answer: "C",
        analysis: "timedatectl 用于查看和设置系统时间、时区；date 主要看时间。"
      },
      {
        type: "single",
        stem: "国产基础设施技术体系迁移方案评估中，以下哪项是兼容性设计的核心原则？",
        options: [
          "优先采用闭源技术保障安全性",
          "通过容器化封装完全规避系统兼容性问题",
          "制定渐进式迁移路径，确保存量业务平滑过渡",
          "要求所有应用立即适配新架构"
        ],
        answer: "C",
        analysis: "兼容性设计的核心是渐进式迁移、平滑过渡，避免一刀切。"
      },
      {
        type: "single",
        stem: "国家 863 重大专项中介绍的“核”“高”“基”中的“高”指的是？",
        options: ["核心电子器件", "高级技术", "高端通用芯片", "基础系统"],
        answer: "C",
        analysis: "“核高基”即核心电子器件、高端通用芯片、基础软件产品。"
      },
      {
        type: "single",
        stem: "导入镜像的命令是？",
        options: ["docker load", "docker save", "docker export", "docker import"],
        answer: "A",
        analysis: "docker load 导入由 docker save 导出的镜像归档；docker import 导入的是容器快照。"
      },
      {
        type: "single",
        stem: "dockerfile 中实现指定命令的运行是？",
        options: ["COPY", "RUN", "VOLUME", "ADD"],
        answer: "B",
        analysis: "RUN 在构建镜像时执行命令；COPY/ADD 复制文件；VOLUME 声明挂载点。"
      },
      {
        type: "single",
        stem: "下面哪个处理器不属于银河麒麟操作系统所支持的国产 CPU 平台？",
        options: ["飞腾处理器", "申威处理器", "英特尔处理器", "海光处理器"],
        answer: "C",
        analysis: "飞腾、申威、海光、龙芯、鲲鹏均为国产 CPU；英特尔是国外 x86 处理器。"
      },
      {
        type: "single",
        stem: "在评估操作系统 CPU 性能是否良好时，以下哪项指标组合通常被视为健康且资源充足的关键信号？",
        options: [
          "CPU 平均使用率长期低于 30%，且系统负载平均值远低于 CPU 逻辑核心数",
          "CPU 平均使用率接近 80%，但系统负载平均值持续高于 CPU 逻辑核心数的 2 倍",
          "CPU 平均使用率在合理范围内（例如 60%-80%），系统负载平均值稳定在 CPU 逻辑核心数附近，且 vmstat 显示 us(用户态)和 sy(内核态)比例健康，wa(I/O 等待)较低",
          "CPU 主频（GHz）达到当前市场最高水平"
        ],
        answer: "C",
        analysis: "综合看使用率、负载与逻辑核数的关系、us/sy 比例和 wa，才是健康信号；单看主频或过低使用率都不能说明问题。"
      },
      {
        type: "single",
        stem: "下列哪种文件后缀通常表示纯归档文件？",
        options: [".rar", ".zip", ".tar", ".tar.gz"],
        answer: "C",
        analysis: ".tar 是仅打包不压缩的纯归档；.tar.gz 是打包并压缩。"
      },
      {
        type: "single",
        stem: "关于归档管理器，下列描述错误的是？",
        options: [
          "即可以创建纯归档文件，也可以创建归档压缩文件",
          "过大的文件可以归档为多个文件",
          "归档管理器是麒麟操作系统默认压缩解压工具",
          "新建归档文件不能设置密码"
        ],
        answer: "D",
        analysis: "归档管理器新建归档时可以设置密码，D 描述错误。"
      },
      {
        type: "single",
        stem: "有压缩文件名为 file.tar.gz，则通常情况下，应该使用以下哪个指令将文件解压开？",
        options: ["tar -cvzf file.tar.gz", "tar -xvf file.tar.gz", "tar -xvgf file.tar.gz", "tar -xvzf file.tar.gz"],
        answer: "D",
        analysis: "解压 .tar.gz 需要 x（解压）+ z（gzip）+ v（显示过程）+ f（指定文件）。"
      },
      {
        type: "single",
        stem: "关于银河麒麟桌面操作系统，下列描述错误的是？",
        options: [
          "桌面是用户进行图形界面操作的基础",
          "用户可以在桌面上放置常用文件和应用程序的快捷方式图标",
          "麒麟操作系统桌面与 Windows10 桌面完全一致",
          "在桌面上，可以新建、删除、移动文件"
        ],
        answer: "C",
        analysis: "麒麟桌面借鉴了常见桌面交互习惯，但不可能与 Windows 10 完全一致。"
      },
      {
        type: "single",
        stem: "在银河麒麟服务器操作系统命令终端中，可通过哪个按键实现命令自动补全功能？",
        options: ["【Ctrl】键", "【Tab】键", "【Alt】键", "【Shift】键"],
        answer: "B",
        analysis: "Tab 补全命令、文件名；连按两次 Tab 可列出候选。"
      },
      {
        type: "single",
        stem: "在银河麒麟操作系统中，使用 chmod 命令设置文件权限时，数字权限 755 表示？",
        options: [
          "所有者读、写、执行，同组读、执行，其他读、执行",
          "所有者读、写、执行，同组读、写，其他读",
          "所有者读、写，同组读、执行，其他读",
          "所有者读、写、执行，同组读、写、执行，其他读、写"
        ],
        answer: "A",
        analysis: "7=rwx，5=r-x，5=r-x。"
      },
      {
        type: "single",
        stem: "日志轮转配置中，保留最近 7 天日志的参数是？",
        options: ["keep 7", "rotate 7", "maxdays 7", "retain 7"],
        answer: "C",
        analysis: "logrotate 中 maxdays 按天数保留；rotate 是按轮转份数保留。"
      },
      {
        type: "single",
        stem: "决定 shell 到哪些目录中寻找命令或程序的是下列哪个环境变量？",
        options: ["HOME", "LOGNAME", "PATH", "HISTSIZE"],
        answer: "C",
        analysis: "PATH 用冒号分隔一系列目录，shell 按顺序查找可执行文件。"
      },
      {
        type: "single",
        stem: "打包应用过程中，把编译好的应用安装到指定位置，这一步在 spec 文件哪个阶段中进行？",
        options: ["%prep", "%build", "%install", "%files"],
        answer: "C",
        analysis: "%prep 解压打补丁，%build 编译，%install 安装到构建根目录，%files 声明打包文件清单。"
      },
      {
        type: "single",
        stem: "nohup 可以后台运行程序，默认情况下会将输出写入 nohup.out，当要后台运行 pro1 程序，且不想要输出和错误信息的话，应使用下列哪条指令？",
        options: [
          "nohup pro1 2>&1 >/dev/null &",
          "nohup pro1 >/dev/null 2>error &",
          "nohup pro1 >/dev/null 2>&1 &",
          "pro1 >/dev/null 2>&1 &"
        ],
        answer: "C",
        analysis: "标准输出重定向到 /dev/null，再 2>&1 把标准错误也指向同一位置，最后 & 后台运行。A 顺序反了，错误仍会输出到终端。"
      },
      {
        type: "single",
        stem: "统计系统中共有多少用户可以使用如下哪条指令？",
        options: ["ls /etc/passwd", "cat /etc/passwd|wc -l", "cat /etc/passwd|wc -w", "wc -w /etc/passwd"],
        answer: "B",
        analysis: "/etc/passwd 每行一个用户，wc -l 统计行数即用户数。"
      },
      {
        type: "single",
        stem: "关于安装包描述正确的是？",
        options: [
          "deb 包仅适用与 ubuntu 操作系统",
          "rpm 包仅适用于 RedHat 操作系统",
          "deb 包和 rpm 包可以通用",
          "麒麟服务器操作系统使用 rpm 指令进行包管理"
        ],
        answer: "D",
        analysis: "deb 适用于 Debian 系，rpm 适用于 RedHat 系，两者不通用；银河麒麟服务器版基于 rpm 包管理。"
      },
      {
        type: "single",
        stem: "note_2.5.3-2re_arm64.rpm 包的名称含义，描述错误的是？",
        options: ["软件包名称：note", "版本：2.5.3", "修订号：2re", "平台：Linux"],
        answer: "D",
        analysis: "rpm 命名规则为 名称-版本-修订号-平台.rpm，arm64 表示 CPU 架构平台，不是“Linux”。"
      },
      {
        type: "single",
        stem: "麒麟操作系统中，程序运行有若干优先级，最低的优先级是？",
        options: ["0", "-5", "10", "19"],
        answer: "D",
        analysis: "nice 值范围 -20（最高）到 19（最低），普通用户只能调大 nice 值。"
      },
      {
        type: "single",
        stem: "系统引导的过程一般包括如下几步：1 用户登录 2 麒麟操作系统内核运行 3 MBR 中的引导程序启动 4 Init 进程运行 5 BIOS 自检。正确的顺序是？",
        options: ["5 3 2 4 1", "5 1 2 3 4", "5 2 3 4 1", "1 2 3 4 5"],
        answer: "A",
        analysis: "BIOS 自检 → MBR 引导程序 → 内核 → init/systemd → 用户登录。"
      },
      {
        type: "single",
        stem: "关于网络配置下列说法错误的是？",
        options: [
          "IP 地址：互联网上的每一台主机分配一个物理地址，以此来屏蔽网络地址的差异",
          "子网掩码：用于实现本地网络通信",
          "网关：可以进行跨网络通信",
          "DNS：域名和 IP 地址相互映射的一个分布式数据库服务器"
        ],
        answer: "A",
        analysis: "IP 地址是逻辑地址，不是物理地址；物理地址指 MAC 地址。IP 用于屏蔽底层物理地址差异。"
      },
      {
        type: "single",
        stem: "若想测试与 IP 地址 192.168.146.12 的主机间网络是否连通，可以使用哪条指令？",
        options: ["ifconfig 192.168.146.12", "ping 192.168.146.12", "ping to 192.168.146.12", "netstat 192.168.146.12"],
        answer: "B",
        analysis: "ping 直接跟目标地址，没有 ping to 这种写法；ifconfig 配置网卡；netstat 查看连接状态。"
      }
    ]
  },

  {
    group: "二、多选题（30 分）",
    questions: [
      {
        type: "multiple",
        stem: "目前在 PC 端主流的操作系统有？",
        options: ["Windows", "Linux", "macOS", "Android"],
        answer: "A,B,C",
        analysis: "Android 主要面向移动端，不属于 PC 端主流操作系统。"
      },
      {
        type: "multiple",
        stem: "以下属于 Linux 发行版的有？",
        options: ["Ubuntu", "CentOS", "麒麟操作系统", "redhat"],
        answer: "A,B,C,D",
        analysis: "四者都是基于 Linux 内核的发行版。"
      },
      {
        type: "multiple",
        stem: "以下属于麒麟操作系统核心竞争力的是？",
        options: ["高安全", "高可用", "全开源", "可定制"],
        answer: "A,B,D",
        analysis: "麒麟主打高安全、高可用、可定制等能力；其商业版本并非“全开源”。"
      },
      {
        type: "multiple",
        stem: "Shell 的基本功能有哪些？",
        options: [
          "Tab 命令补全功能",
          "别名（Alias）功能",
          "查阅历史记录（history 命令）",
          "任务控制（Job Control）",
          "软件安装"
        ],
        answer: "A,B,C,D",
        analysis: "软件安装由包管理工具（rpm/yum/apt）完成，不属于 shell 本身的功能。"
      },
      {
        type: "multiple",
        stem: "以下 sudo 命令使用注意事项正确的是？",
        options: [
          "sudo 运行命令时不会提示输入当前用户的密码",
          "不是所有命令都能用 sudo 执行",
          "sudo 命令会有日志记录用户输入的命令等信息",
          "sudo 的配置文件为 /etc/sudoers"
        ],
        answer: "B,C,D",
        analysis: "sudo 会提示输入“当前用户”的密码，A 错误。"
      },
      {
        type: "multiple",
        stem: "以下哪些操作可以查看到指定用户的 UID？",
        options: ["查看 /etc/passwd 文件", "查看 /etc/shadow 文件", "id 指定用户名", "whoami"],
        answer: "A,C",
        analysis: "/etc/passwd 第 3 列为 UID；id 用户名 直接显示；/etc/shadow 存密码；whoami 只显示当前用户名。"
      },
      {
        type: "multiple",
        stem: "关于文件名，下列描述正确的有？",
        options: [
          "文件名称最长可以有 256 个字符",
          "麒麟操作系统中没有文件扩展名的概念",
          "文件名中无法使用特殊字符",
          "以“.”开头的文件都是隐藏文件"
        ],
        answer: "B,D",
        analysis: "Linux 文件名最长 255 个字符，A 错；文件名可以使用大部分特殊字符（除 / 和空字符），C 错。"
      },
      {
        type: "multiple",
        stem: "现有文件 file1，权限为 644，以下命令中可以为文件所有者加上执行权限的操作有？",
        options: ["chmod u=x file1", "chmod 744 file1", "chmod u+x file1", "chmod u=rwx file1"],
        answer: "B,C,D",
        analysis: "u=x 会把所有者的 rw 覆盖成只剩 x，是替换而非“加上”执行权限。"
      },
      {
        type: "multiple",
        stem: "关于 SUID，以下说法正确的有？",
        options: [
          "SUID 仅对二进制程序有效",
          "执行者对该程序需要有 x 可执行权限",
          "本权限仅在执行该程序的过程中有效",
          "执行者将具有该程序拥有者的权限"
        ],
        answer: "A,B,C,D",
        analysis: "四项均为 SUID 的标准特性，典型如 /usr/bin/passwd。"
      },
      {
        type: "multiple",
        stem: "vi 编辑器中哪些按键可以从命令模式进入输入模式？",
        options: ["a 键", "i 键", "o 键", "r 键"],
        answer: "A,B,C,D",
        analysis: "i 光标前插入、a 光标后插入、o 下方新行插入、r 替换单个字符，均可进入输入状态。"
      },
      {
        type: "multiple",
        stem: "关于系统基本数据流描述正确的是？",
        options: [
          "标准输入的文件描述符为 1",
          "标准输出的文件描述符为 1",
          "标准错误输出的文件描述符为 2",
          "正常信息送到标准输出，而错误信息则送到标准错误输出"
        ],
        answer: "B,C,D",
        analysis: "标准输入是 0，A 错误。"
      },
      {
        type: "multiple",
        stem: "关于 YUM 描述正确的是？",
        options: [
          "yum 安装和卸载软件包时自动寻找最新版本，并自动解决软件的依赖关系",
          "yum 软件源需要是远程的 ftp 服务器或 http 服务器",
          "麒麟操作系统 yum 源需要用户自己配置",
          "使用 yum install 命令执行软件包安装有关的操作"
        ],
        answer: "A,C,D",
        analysis: "yum 源也可以是本地光盘（file://），不必是远程服务器，B 错误。"
      },
      {
        type: "multiple",
        stem: "关于命令行配置网络 nmcli 工具描述正确的是？",
        options: [
          "可以显示所有连接",
          "可以启停网络连接",
          "修改后立即生效，但重启后失效",
          "可以修改网卡的 IP 地址和网关"
        ],
        answer: "A,B,D",
        analysis: "nmcli 修改的是持久化配置，重启后依然生效，C 错误。"
      },
      {
        type: "multiple",
        stem: "常见网络故障有哪些？",
        options: ["网络配置问题", "网卡硬件问题", "驱动程序问题", "网络层、传输层、应用层问题"],
        answer: "A,B,C,D",
        analysis: "从物理硬件、驱动、配置到各协议层都可能出问题。"
      },
      {
        type: "multiple",
        stem: "银河麒麟服务器操作系统 V10，默认使用防火墙为？",
        options: ["iptables 防火墙", "静态防火墙", "firewall 防火墙", "动态防火墙"],
        answer: "C,D",
        analysis: "麒麟 V10 默认 firewalld，属于动态防火墙；iptables 是静态防火墙。"
      },
      {
        type: "multiple",
        stem: "KYSEC 是银河麒麟服务器操作系统的强制访问的默认选择，其基于 kysec 安全标记进行保护的一种安全机制，主要保护对象有？",
        options: ["内核模块", "硬件", "脚本文件", "共享库"],
        answer: "A,C,D",
        analysis: "KYSEC 保护内核模块、脚本文件、共享库、可执行文件等；硬件不在其保护范围。"
      },
      {
        type: "multiple",
        stem: "下列哪些方式可以查看内存的信息？",
        options: ["uname", "top", "kill", "free"],
        answer: "B,D",
        analysis: "top 实时显示内存占用，free 显示内存使用统计；uname 看内核信息，kill 结束进程。"
      },
      {
        type: "multiple",
        stem: "在国产操作系统中，关于硬链接的描述正确的是？",
        options: ["可以跨文件系统", "不可以跨文件系统", "为链接文件创建新的 i 节点", "链接文件的 i 节点与被链接文件的 i 节点相同"],
        answer: "B,D",
        analysis: "硬链接不能跨文件系统，且与原文件共用同一个 inode。"
      },
      {
        type: "multiple",
        stem: "在国产操作系统中，对 LVM 逻辑卷进行扩容（针对 ext4 文件系统）的正确操作步骤包含？",
        options: [
          "先通过 pvcreate 初始化新增磁盘，再用 vgextend 将其加入目标卷组（VG）",
          "直接执行 lvextend -L +20G /dev/vg01/lv01 扩展逻辑卷（无需关联卷组）",
          "扩展逻辑卷后，执行 resize2fs /dev/vg01/lv01 调整 ext4 文件系统大小",
          "扩容全程需卸载逻辑卷（umount /dev/vg01/lv01），否则会导致数据损坏"
        ],
        answer: "A,C",
        analysis: "扩容需先把新 PV 加入 VG，扩展 LV 后再 resize 文件系统；ext4 支持在线扩容，无需卸载。"
      },
      {
        type: "multiple",
        stem: "在迁移到国产操作系统时，哪些策略可以降低迁移风险？",
        options: ["分阶段实施迁移", "完全重写应用代码", "对现有软件进行封装", "进行充分的测试"],
        answer: "A,C,D",
        analysis: "完全重写应用代码成本高、风险大，不是降低风险的策略。"
      },
      {
        type: "multiple",
        stem: "在银河麒麟服务器操作系统中，下列描述正确的是？",
        options: [
          "/etc/ld.so.conf 是 ping 的配置文件",
          "tar -czvf filename.tgz * 此命令可以打包并压缩文件",
          "httpd.conf 是 apache 的主配置文件",
          "tar -xzvf filename.tgz 此命令可以解压缩 tar 文件"
        ],
        answer: "B,C,D",
        analysis: "/etc/ld.so.conf 是动态链接库搜索路径配置，与 ping 无关。"
      },
      {
        type: "multiple",
        stem: "以下哪些命令能够在麒麟系统中创建文件 kylinfile？",
        options: ["ls kylinfile", "touch kylinfile", "echo \"\" > kylinfile", "mkdir kylinfile"],
        answer: "B,C",
        analysis: "touch 创建空文件，echo 重定向也能创建；ls 只列出，mkdir 创建的是目录。"
      },
      {
        type: "multiple",
        stem: "麒麟系统中变量按时效可分为哪几类？",
        options: ["自定义时间变量", "永久变量", "临时变量", "阶段变量"],
        answer: "B,C",
        analysis: "按时效分为临时变量（当前 shell 有效）和永久变量（写入配置文件长期生效）。"
      },
      {
        type: "multiple",
        stem: "银河麒麟服务器操作系统用户账户类型有哪些？",
        options: ["root", "受限用户", "系统用户", "普通用户"],
        answer: "A,C,D",
        analysis: "Linux 用户分为 root、系统用户（服务账户）、普通用户三类。"
      },
      {
        type: "multiple",
        stem: "以下对 init 和 systemd 区别，描述正确的是？",
        options: [
          "init 服务串行启动；systemd 并行启动，启动速度更快",
          "systemd 除了作为初始化进程，它还提供了日志管理等一系列其它功能",
          "systemd 管理的系统资源称为 unit，unit 共有 12 种，其中包括 device service socket target 等",
          "sysvinit 运行级别在 systemd 体系下无法继续使用"
        ],
        answer: "A,B,C",
        analysis: "systemd 通过 target 兼容了传统运行级别，D 错误。"
      },
      {
        type: "multiple",
        stem: "想要对服务器 CPU 性能进行评估，执行 vmstat 命令输出结果中哪些参数能体现 CPU 负载？",
        options: ["si", "so", "us", "sy"],
        answer: "C,D",
        analysis: "us 用户态占比、sy 内核态占比反映 CPU 负载；si/so 是 swap 换入换出。"
      },
      {
        type: "multiple",
        stem: "以下哪些是麒麟桌面操作系统的有线连接方式？",
        options: ["以太网 DHCP 方式", "WIFI 方式", "以太网静态 IP 方式", "蓝牙方式"],
        answer: "A,C",
        analysis: "DHCP 和静态 IP 都是以太网有线连接方式；WIFI、蓝牙属于无线。"
      },
      {
        type: "multiple",
        stem: "下列哪些功能不是操作系统的主要功能？",
        options: ["进程管理", "内存管理", "为用户提供游戏", "提供娱乐软件"],
        answer: "C,D",
        analysis: "操作系统负责进程、内存、文件、设备管理；游戏和娱乐软件是应用软件。"
      },
      {
        type: "multiple",
        stem: "在银河麒麟操作系统中，能够打开终端的方式有？",
        options: ["开始菜单—所有软件—终端", "WIN+R，输入 CMD 指令", "桌面右击—打开终端", "快捷键<Ctrl+Alt+T>"],
        answer: "A,C,D",
        analysis: "WIN+R/CMD 是 Windows 的打开方式，麒麟中不适用。"
      },
      {
        type: "multiple",
        stem: "关于麒麟操作系统密码强度说法正确的是？",
        options: [
          "高级模式的密码长度至少 8 位，至少包含大小写字符两种",
          "中级模式的密码长度至少 6 位，至少包含大小写字符中的一种",
          "低级模式不对用户密码进行限制",
          "自定义模式根据需求自定义相应的密码强度策略"
        ],
        answer: "A,B,C,D",
        analysis: "麒麟的安全中心提供低级、中级、高级、自定义四档密码强度策略。"
      }
    ]
  },

  {
    group: "三、判断题（20 分）",
    questions: [
      {
        type: "judge",
        stem: "麒麟操作系统支持多种架构的 CPU，所以无需考虑 CPU 是否兼容，直接安装操作系统即可。",
        answer: false,
        analysis: "不同架构的 CPU 需要对应架构的安装镜像，装错架构无法启动，必须先确认兼容性。"
      },
      {
        type: "judge",
        stem: "若组 g1 内仅有一个成员 user01，且 g1 为 user01 的附加组，则组 g1 可以直接删除。",
        answer: true,
        analysis: "g1 不是 user01 的主组且无其他成员，可以直接删除，不影响用户登录。"
      },
      {
        type: "judge",
        stem: "rmdir 命令可以删除目录，无论目录是否为空。",
        answer: false,
        analysis: "rmdir 只能删除空目录，非空目录需用 rm -r。"
      },
      {
        type: "judge",
        stem: "setfacl 可以对除默认 u、g、o 以外的用户和组设置权限。",
        answer: true,
        analysis: "ACL 正是为默认三类主体之外的具体用户/组单独授权。"
      },
      {
        type: "judge",
        stem: "vi 编辑器的三种模式间可以直接相互转换。",
        answer: false,
        analysis: "输入模式不能直接切到末行模式，必须先按 Esc 回命令模式再转换。"
      },
      {
        type: "judge",
        stem: "sort 将文件的每一行作为一个单位，相互比较，比较原则是从首字符向后，依次按 ASCII 码值进行比较，最后将他们按从大到小的顺序输出。",
        answer: false,
        analysis: "sort 默认按 ASCII 码值从小到大（升序）输出，需要降序应加 -r。"
      },
      {
        type: "judge",
        stem: "可以从麒麟操作系统的归档管理器中向某归档文件内添加新文件。",
        answer: true,
        analysis: "归档管理器支持向已有归档中追加文件。"
      },
      {
        type: "judge",
        stem: "已知 /etc/crontab 文件内容如下：10,20 9-21 * * * root command，表示每天 9-21 点的第 10 和 20 分钟执行 command。这种说法是否正确？",
        answer: true,
        analysis: "分钟字段 10,20 表示第 10、20 分，小时字段 9-21 表示 9 点到 21 点，解析正确。"
      },
      {
        type: "judge",
        stem: "at 和 cron 配置文件，allow 比 deny 的优先级更高。这种说法是否正确？",
        answer: true,
        analysis: "allow 文件存在时只允许其中列出的用户，deny 被忽略，因此 allow 优先。"
      },
      {
        type: "judge",
        stem: "所有 U 盘都可以进行系统安装使用，仅需将操作系统镜像文件放入 U 盘即可。",
        answer: false,
        analysis: "需要用工具把镜像写入 U 盘做成启动盘，且 U 盘容量、接口、引导方式都要满足要求。"
      },
      {
        type: "judge",
        stem: "nmtui 是以简易图形方式配置网络信息，需要图形操作界面支持。",
        answer: false,
        analysis: "nmtui 是基于文本字符界面的 TUI 工具，不需要图形桌面环境。"
      },
      {
        type: "judge",
        stem: "若系统中存在三个分区，则这三个分区的编号可以是 sda1,sda5,sda6。",
        answer: true,
        analysis: "sda1 作为扩展分区，sda5、sda6 为其内的逻辑分区，完全合法。"
      },
      {
        type: "judge",
        stem: "挂载是指将设备文件中的硬件设备连接到 Linux 根目录下的某一目录（最好是空目录），访问此目录就等同于访问设备文件。",
        answer: true,
        analysis: "这是挂载的标准定义，挂载点一般选空目录以免遮盖原有内容。"
      },
      {
        type: "judge",
        stem: "国产化自主创新的背后是国家对信息安全和网络安全的重视。",
        answer: true,
        analysis: "国产化替代的核心驱动力之一就是自主可控与信息安全。"
      },
      {
        type: "judge",
        stem: "银河麒麟服务器操作系统支持以太网网络协议。",
        answer: true,
        analysis: "以太网是标准网络接入方式，麒麟服务器系统完整支持。"
      },
      {
        type: "judge",
        stem: "银河麒麟服务器操作系统的文件系统是网状结构的文件系统。",
        answer: false,
        analysis: "Linux 文件系统是树形（层次）结构，根目录 / 为起点。"
      },
      {
        type: "judge",
        stem: "在国产操作系统中，/etc/shadow 文件存储用户的加密密码和账户过期信息。",
        answer: true,
        analysis: "/etc/shadow 仅 root 可读，保存加密口令及密码有效期等字段。"
      },
      {
        type: "judge",
        stem: "银河麒麟操作系统的安装过程中，可以实现对磁盘进行分区。",
        answer: true,
        analysis: "安装向导中可选手动分区或自动分区。"
      },
      {
        type: "judge",
        stem: "在国产操作系统下，普通用户不能通过 passwd 命令修改自己的密码。",
        answer: false,
        analysis: "普通用户可以直接执行 passwd 修改自己的密码（需先输入原密码）。"
      },
      {
        type: "judge",
        stem: "由于技术的局限性，我们不能跨分区对目录文件进行软链接。",
        answer: false,
        analysis: "软链接保存的是目标路径字符串，可以跨分区甚至跨文件系统。"
      }
    ]
  }
];
