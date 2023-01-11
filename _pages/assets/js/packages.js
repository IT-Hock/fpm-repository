$(document).ready(function () {
    let hideOutdated = true;
    let filterFunction = function (settings, data, dataIndex) {
        let updated_days = data[3];
        if (hideOutdated && updated_days > 186) {
            return false;
        }
        return true;
    };
    let table = $('#packages_table').DataTable({
        "order": [
            [1, "asc"]
        ],
        "columnDefs": [
            {
                "sortable": false,
                "searchable": false,
                "targets": 1
            },
            {
                "sortable": false,
                "searchable": false,
                "targets": 2
            }

        ],
        "sDom": 'rtip'
    });
    $.fn.dataTable.ext.search.push(filterFunction);
    table.draw();
    
    $('#search_input').on('keyup', function () {
        if (this.value.length < 3) {
            table.search("", false, true).draw();
            return;
        }
        table.search(this.value, false, true).draw();
    });

    $('#page_length').on('change', function () {
        table.page.len(this.value).draw();
    });

    $('#hide_outdated').click(function () {
        /* if has class bg-gray it's not active */
        if ($(this).hasClass('bg-gray')) {
            $(this).removeClass('bg-gray');
            $(this).addClass('bg-red');
            hideOutdated = true;
            
            $.fn.dataTable.ext.search.push(filterFunction);
            table.draw();
        } else {
            $(this).removeClass('bg-red');
            $(this).addClass('bg-gray');
            hideOutdated = false;
            $.fn.dataTable.ext.search.pop();
            table.draw();
        }
    });
    
    table.on('draw', function () {
        $('.filter-tag').each(function () {
            $(this).click(function () {
                let tag = $(this).data('filter');
                let activeTagFilterElement = $('#active-tag-filter')
                activeTagFilterElement.html("<span class='badge bg-gray' title='Active filter: " + tag + "'>#" + tag + "</span>");
                activeTagFilterElement.click(function () {
                    $.fn.dataTable.ext.search.pop();
                    table.draw();
                    $('#active-tag-filter').html('');
                });
                $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                    let tags = data[2];
                    if (tags.includes(tag)) {
                        return true;
                    }
                    return false;
                });
                table.draw();
            });
        });
    });
});